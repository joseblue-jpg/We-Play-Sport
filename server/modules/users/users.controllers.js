import bcrypt from "bcrypt";
import executeQuery, { dbPool } from "../../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendMail from "../../services/emailService.js";

dotenv.config();

class UsersControllers {
  register = async (req, res) => {
    const { user_name, last_name, birth_date, email, password } = req.body;

    let sql =
      "INSERT INTO user (user_name, last_name, birth_date, email, password) VALUES (?,?,?,?,?)";

    try {
      let hash = await bcrypt.hash(password, 10);
      let values = [user_name, last_name, birth_date, email, hash];

      const result = await executeQuery(sql, values);

      const token = await new Promise((resolve, reject) => {
        jwt.sign(
          { id: result.insertId },
          process.env.TOKEN_KEY_CONFIRM_REGISTER,
          {},
          (error, token) => {
            if (error) reject(error);
            resolve(token);
          }
        );
      });

      let mailConfig = {
        email,
        user_name,
        last_name,
        token,
        typeEmail: "confirmUser",
      };

      await sendMail(mailConfig);

      res.status(200).json("Registro con éxito");
    } catch (error) {
      console.error("Error en el registro:", error);

      // Manejo de error por email duplicado
      //ER_DUP_ENTRY es un código de error de MySQL que significa "entrada duplicada"
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already registered" });
      }

      res.status(500).json({ message: "Error en el servidor" });
    }
  };

  confirmRegister = async (req, res) => {
    const { user_id } = req;
   

    let sql = "SELECT is_verified FROM user WHERE user_id = ?";

    try {
      let [result] = await executeQuery(sql, [user_id]);

      if (result.is_verified === 0) {
        let sql2 = "UPDATE user SET is_verified=1 WHERE user_id=?";
        await executeQuery(sql2, [user_id]);
        res.status(200).json("Usuario validado");
      } else {
        res.status(200).json("Ya estaba validado");
      }
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
      let sql =
        "SELECT * FROM user WHERE email=? AND is_verified=1 AND is_disabled=0";
      let result = await executeQuery(sql, [email]);
      if (result.length != 0) {
        let token = jwt.sign({ email }, process.env.TOKEN_KEY_FORGOT_PASSWORD, {
          expiresIn: "10min",
        });

        let mailConfig = {
          email,
          user_name: null,
          last_name: null,
          token,
          typeEmail: "forgotPassword",
        };

        await sendMail(mailConfig);
        res.status(200).json("Hola");
      } else {
        throw new Error("El usuario no existe");
      }
    } catch (error) {
      if (error.message === "El usuario no existe") {
        res.status(406).json("El usuario no existe");
      } else {
        res.status(500).json("Error de sistema");
      }
    }
  };

  newPassword = async (req, res) => {
    const { newPassword } = req.body;
    const { email } = req;

    let sql = "UPDATE user SET password=? WHERE email=?";
    try {
      let hash = await bcrypt.hash(newPassword, 10);
      await executeQuery(sql, [hash, email]);
      res.status(200).json("TODO OK");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  login = async (req, res) => {
    /* to do: validación login front y back */
    const { email, password } = req.body;

    // First check if the user exists without verification constraint
    let sql = "SELECT * FROM user WHERE email = ?";
    let values = [email];

    try {
      const result = await executeQuery(sql, values);

      if (result.length === 0) {
        // User doesn't exist
        res.status(401).json({ message: "Credenciales incorrectas" });
      } else {
        // User exists, check if verified
        if (result[0].is_verified !== 1) {
          // User exists but is not verified
          res.status(403).json({ message: "Usuario no verificado" });
          return;
        }

        // Check password
        let hash = result[0].password;
        let match = await bcrypt.compare(password, hash);

        if (!match) {
          res.status(401).json({ message: "Credenciales incorrectas" });
        } else {
          let payload = {
            id: result[0].user_id,
            is_admin: result[0].is_admin
          };
          const token = jwt.sign(payload, process.env.TOKEN_KEY, {
            expiresIn: "2d",
          });
          res.status(200).json(token);
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error del servidor" });
    }
  };

  userById = async (req, res) => {
    const { user_id } = req;
    
    try {
      let sql = "SELECT * FROM user WHERE user_id = ? AND is_disabled = 0";
      let values = [user_id];
      const result = await executeQuery(sql, values);
      res.status(200).json(result[0]);
    } catch (error) {
      res.status(500).json(error);
    }
  };

  editUser = async (req, res) => {
    // Extraemos los datos del usuario desde el request
    const {
      user_id,
      user_name,
      last_name,
      phone_number,
      birth_date,
      identity_doc,
      nationality,
      user_address,
      zip_code,
      user_city,
      province,
      user_country,
      gender,
    } = JSON.parse(req.body.data);

    try {
      // Consulta SQL base para actualizar los datos del usuario
      let sql = `
        UPDATE user 
        SET 
          user_name=?, 
          last_name=?, 
          phone_number=?, 
          birth_date=?, 
          identity_doc=?, 
          nationality=?, 
          user_address=?, 
          zip_code=?, 
          user_city=?, 
          province=?, 
          user_country=?, 
          gender=?
        WHERE user_id = ?
      `;
      let values = [
        user_name,
        last_name,
        phone_number,
        birth_date,
        identity_doc,
        nationality,
        user_address,
        zip_code,
        user_city,
        province,
        user_country,
        gender,
        user_id,
      ];

      // Si el usuario sube una nueva imagen, actualizamos el campo user_photo
      if (req.files && req.files.user_photo) {
        const user_photo = req.files.user_photo[0].filename; // Nombre del archivo subido
        sql = `
          UPDATE user 
          SET 
            user_name=?, 
            last_name=?, 
            phone_number=?, 
            birth_date=?, 
            identity_doc=?, 
            nationality=?, 
            user_address=?, 
            zip_code=?, 
            user_city=?, 
            province=?, 
            user_country=?, 
            gender=?,
            user_photo=?
          WHERE user_id = ?
        `;
        values = [
          user_name,
          last_name,
          phone_number,
          birth_date,
          identity_doc,
          nationality,
          user_address,
          zip_code,
          user_city,
          province,
          user_country,
          gender,
          user_photo, // Agregamos el nombre del archivo a los valores
          user_id,
        ];
      }

      // Ejecutamos la consulta en la base de datos
      let result = await executeQuery(sql, values);

      // Si el usuario sube un nuevo pdf de federado, actualizamos el campo file
      if (req.files && req.files.file) {
        const file = req.files.file[0].filename; // Nombre del archivo subido
        sql = `
          UPDATE user 
          SET 
            user_name=?, 
            last_name=?, 
            phone_number=?, 
            birth_date=?, 
            identity_doc=?, 
            nationality=?, 
            user_address=?, 
            zip_code=?, 
            user_city=?, 
            province=?, 
            user_country=?, 
            gender=?,
            file=?
          WHERE user_id = ?
        `;
        values = [
          user_name,
          last_name,
          phone_number,
          birth_date,
          identity_doc,
          nationality,
          user_address,
          zip_code,
          user_city,
          province,
          user_country,
          gender,
          file, // Agregamos el nombre del archivo a los valores
          user_id,
        ];
      }

      // Ejecutamos la consulta en la base de datos
      let result1 = await executeQuery(sql, values);

      // Enviamos la respuesta con el nombre del archivo si se actualizó
      res.status(200).json({
        success: true,
        message: "Usuario actualizado correctamente",
        user_photo: req.files?.user_photo
          ? req.files.user_photo[0].filename
          : null,
        file: req.files?.file ? req.files.file[0].filename : null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: "Error al actualizar el usuario",
        error,
      });
    }
  };

  disableUser = async (req, res) => {
    
    const { id } = req.params;

    try {
      let sql = "UPDATE user SET is_disabled=1 WHERE user_id=?";
      let values = [id];
      await executeQuery(sql, values);
      res.status(200).json("borrado lógico");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  };

  deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      let sql = "DELETE FROM user WHERE user_id=?";
      let values = [id];
      await executeQuery(sql, values);
      res.status(200).json("borrado total");
    } catch (error) {
      res.status(500).json(error);
    }
  };

  eventInscription = async (req, res) => {

    
    const validateData = (data) => {
      let res = false;
      if (data.team_name) {
        const nameRegex = /^[a-zA-Z0-9]+(?:[-\s][a-zA-Z0-9]+)*$/;
        res = nameRegex.test(data.team_name);
      }
      if (res && data.members.length > 0 && Array.isArray(data.members)) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        res = data.members.every((elem) => emailRegex.test(elem));
      }
      return res;
    };
    console.log("hola0");
    
    try {
      if (validateData(req.body)) {
        const { team_owner, event_id, members, team_name } = req.body;
        console.log("hola1");
        
        let sql = `SELECT email, user_id FROM user WHERE email in (?)`;
        let result = await executeQuery(sql, [members]);
        if (result.length != members.length) {
          throw new Error("Email inexistente");
        };
        console.log("hola1");
        
        let sql2 = `INSERT INTO team (team_name) VALUES (?)`;
        let result2 = await executeQuery(sql2, [team_name]);
        let team_id = result2.insertId;
        
        console.log("hola1");
        let sql3 = `INSERT INTO user_team (user_id, team_id) VALUES (?,?)`;
        let res3 = await executeQuery(sql3, [team_owner, team_id]);
        console.log("hola1");
        
        res.status(200).json({ message: "OK", team_id });
      } else {
        throw new Error("Completa todos los campos");
      }
    } catch (error) {
      //fin del try
      console.log(error);

      res.status(500).json(error.message);
    }
  };

  eventInscriptionIndividual = async (req, res) => {
    try {
      const { team_owner, team_name } = req.body;

      let sql2 = `INSERT INTO team (team_name) VALUES (?)`;
      let result2 = await executeQuery(sql2, [team_name]);
      let team_id = result2.insertId;

      let sql3 = `INSERT INTO user_team (user_id, team_id) VALUES (?,?)`;
      let res3 = await executeQuery(sql3, [team_owner, team_id]);

      res.status(200).json({success: true, team_id});
    } catch (error) {
      res.status(500).json({error});
    }
  };

  paymentData = async (req, res) => {

    
    const { team_owner, team_id, event_id } = req.body;

    try {
      let sql = `SELECT u.user_name, u.last_name, e.event_name, e.sport_name, e.level_category, e.gender_category, e.time_start, e.date_start, e.check_in, e.event_country, e.event_city, e.event_address, e.price, t.team_name FROM user u CROSS JOIN event e CROSS JOIN team t WHERE u.user_id = ? AND e.event_id=? AND t.team_id=?`;
      let values = [team_owner, event_id, team_id];
      let result = await executeQuery(sql, values);

      res.status(200).json({ message: "OK", data: result[0] });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json(
          "En el mundo hay 2 tipos de personas: los tontos y los que no leen esto"
        );
    }
  };

  finalInscription = async (req, res) => {

    const { user_id, team_id, event_id, members } = req.body;
    
    try {
      if(members.length > 0){
        // Verificar si todos los correos electrónicos proporcionados existen en la base de datos
        let sql = `SELECT email FROM user WHERE email IN (?)`;        
        let result = await executeQuery(sql, [members]);
        
        // Si algún email no está registrado en la base de datos, enviamos un mensaje de error
        if (result.length !== members.length) {
          // Filtramos los correos electrónicos que no están registrados
          const unregisteredEmails = members.filter(email => !result.some(user => user.email === email));
          // Puedes retornar un mensaje de error específico para los correos no registrados
          return res.status(400).json({
            success: false,
            message: `El/Los siguiente(s) correo(s) no están registrados: ${unregisteredEmails.join(", ")}`
          });
        }
      }
      
      // Si todos los correos están registrados, continuamos con el proceso
      let sql2 = `INSERT INTO registration (user_id, team_id, event_id) VALUES (?,?,?)`;
      let values2 = [user_id, team_id, event_id];
      let result2 = await executeQuery(sql2, values2);
      console.log("hola4");
      
      for (let email of members) {
        let token = jwt.sign(
                { email: email, team_id: team_id, event_id: event_id },
                process.env.TOKEN_KEY_INVITATION,
                {
                  expiresIn: "2d",
                }
          );
          
            let data = {
              email,
              token,
              typeEmail: "invitationEmail",
            };
            
            console.log("hola5");
            await sendMail(data);
            console.log("hola6");
          }
          console.log("hola7");
          
        res.status(200).json({ message: "OK" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error", error });
    }
  };

  acceptInvitationGet = async (req, res) => {
    const { team_id, email, event_id } = req;
    
    try {
      let sql1 = `SELECT * FROM event WHERE event_id=?`;
      let result1 = await executeQuery(sql1, [event_id]);
      
      let sql2 = `SELECT * FROM team WHERE team_id=?`;
      let result2 = await executeQuery(sql2, [team_id]);

      
      let sql3 = `SELECT user_id FROM user WHERE email=?`;
      let result3 = await executeQuery(sql3, [email]);
      res
      .status(200)
      .json({
        message: "OK",
        event_data: result1[0],
        team_data: result2[0],
        user_id: result3[0].user_id,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error", message: error });
    }
  };

  acceptInvitationButton = async (req, res) => {
    let { team_id, user_id, event_id } = req.body;

    const connection = await dbPool.getConnection();

    try {
      await connection.beginTransaction();
      let sql = `INSERT INTO registration (team_id, user_id, event_id) VALUES (?,?,?)`;
      let values = [team_id, user_id, event_id];
      await connection.query(sql, values);

      let sql2 = "INSERT INTO user_team (team_id, user_id) VALUES (?,?)";
      let values2 = [team_id, user_id];
      await connection.query(sql2, values2);

      await connection.commit();

      res.status(200).json({ message: "OK" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: error });
    } finally {
      connection.release();
    }
  };

  profileEventSuscription = async (req, res) => {
    const { user_id } = req.params;
    try {
      let sql =
        "SELECT * FROM event WHERE event_id IN (SELECT event_id FROM registration WHERE user_id=? GROUP BY event_id) AND status != 5";
      let result = await executeQuery(sql, [user_id]);
      res.status(200).json({ message: "Ok", data: result });
    } catch (error) {
      res.status(500).json({ message: "XXXX", error });
    }
  };

  withdrawFromEvent = async (req, res) => {
    const connection = await dbPool.getConnection();

    try {
      let { user_id, event_id } = req.params;
      user_id = parseInt(user_id);
      event_id = parseInt(event_id);

      await connection.beginTransaction();

      // 1º Obtener el team_id
      let sql_1 =
        "SELECT team_id FROM registration WHERE user_id=? AND event_id=?";
      let result_1 = await connection.query(sql_1, [user_id, event_id]);
      let team_id = result_1[0][0].team_id;

      //2º Borrar las tablas de registro, tabla intermedia de los usuarios asociados a los equipos y la del equipo en si
      let sql_2 = "DELETE FROM registration WHERE team_id=?";
      let result_2 = await connection.query(sql_2, [team_id]);

      let sql_3 = "DELETE FROM user_team WHERE team_id=?";
      let result_3 = await connection.query(sql_3, [team_id]);

      let sql_4 = "DELETE FROM team WHERE team_id=?";
      let result_4 = await connection.query(sql_4, [team_id]);


      await connection.commit();

      res
        .status(200)
        .json({
          status: true,
          message: "La inscripción al evento ha sido cancelada con éxito",
        });
    } catch (error) {
      console.error(error);
      connection.rollback();
      res
        .status(500)
        .json({
          status: false,
          message: "Error en la cancelacion de la inscripción",
          error,
        });
    } finally {
      connection.release();
    }
  };

  cancelTeamEvent =async(req, res)=>{
    let {team_id} = req.body;
    
    try {
      let sql = "DELETE FROM team WHERE team_id=?"
      await executeQuery(sql, [team_id])
      res.status(200).json({message: "ok"})
    } 
    catch (error) {
      res.status(500).json({error})
    }
  }
}

export default new UsersControllers();
