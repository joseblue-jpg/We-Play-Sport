import executeQuery from "../../config/db.js";
import dotenv from 'dotenv';
import { dbPool } from "../../config/db.js";

dotenv.config();

class AdminControllers {

  adminAllEvents = async (req, res) =>{

    /**
     *    /admin/AdminAllEvents
     *
     *    INPUT (body): null
     *
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Eventos extraidos"
     *      - En caso de error:
     *            401 - "No autorizado" ---
     *            500 - "Internal error"
     */

      let sql = "SELECT * FROM event WHERE is_deleted=0 ORDER BY status, date_start";
      try {
        let result = await executeQuery(sql)
        res.status(200).json({
          success: true,
          message: "Eventos extraidos correctamente",
          result: result
        })
      }
      catch (error){
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Error en la extracción de los eventos",
          result: null
        })
      }

  }

  editEventStatus = async (req, res) =>{

    /**
     *    /admin/EditStatus/:event_id/:status
     *
     *    INPUT (params): event_id, status
     *
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Evento finalizado"
     *      - En caso de error:
     *            304 - "No changed rows"
     *            401 - "No autorizado" ---
     *            417 - "Status incorrecto"
     *            500 - "Internal error"
     */
   
    try {
      let {event_id, status} = req.params

      // ❌ Por si entra un status que no sea los que contemplamos
      if(status < 1 || status > 5){
        return res.status(417).json({
          success: false,
          message: "Número de status inválido"
        })
      }

      let sql = `UPDATE event SET status=? WHERE event_id = ?`;
      let values = [status, event_id];
      let result = await executeQuery(sql, values);

      // ❌ Si no hay cambios en el SQL
      if(result.changedRows === 0){
        return res.status(304).json({
          success: true,
          message: "No han habido cambios"
        })
      }

      // ✅ Se ha cambiado el estado
      res.status(200).json({
        success: true,
        message: "Status del evento cambiado con éxito"
      })
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al cambiar el status del evento"
      });
    }
  }

  deteleEvent = async (req, res) => {

    /**
     *    /admin/DeleteEvent/:event_id
     *
     *    INPUT (params): event_id
     *
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Evento eliminado"
     *      - En caso de error:
     *            304 - "No se ha podido eliminar"
     *            401 - "No autorizado" ---
     *            500 - "Internal error"
     */

    try {
      let {event_id} = req.params;
      let sql = `UPDATE event SET is_deleted=1 WHERE event_id=? AND is_deleted=0`;
      let values = [event_id];
      let result = await executeQuery(sql, values);

      // ❌ Si no hay cambios en el SQL
      if(result.changedRows === 0){
        return res.status(304).json({
          success: true,
          message: "No han habido cambios"
        })
      }

      // ✅ Se ha podido eliminar
      res.status(200).json({
        success: true,
        message: "Evento borrado correctamente"
      });
    } 
    catch (error) {
      res.stats(500).json({
        success: false,
        message: "Error al borrar el evento"
      });
    }
  }

  createEvent = async (req, res) => {

    const connection = await dbPool.getConnection();
    try {
        let { 
            event_name, 
            season, 
            sport_name, 
            level_category, 
            gender, 
            max_participants, 
            time_start, 
            time_end, 
            date_start, 
            date_end, 
            event_address, 
            event_city, 
            event_country, 
            price, 
            is_team_event, 
            check_in, 
            status, 
            description, 
            google_maps_link,
            result,
            services_array
        } = JSON.parse(req.body.data);

        if (new Date(date_start) > new Date(date_end)) {
        
            return res.status(207).json({
              
                success: false,
                message: "La fecha de inicio no puede ser posterior a la fecha de fin"
            });
        }

        // Si el campo status no está proporcionado, le asignamos un valor predeterminado
        if (typeof status === 'undefined') {
            status = 1; // Asignamos "PRÓXIMAMENTE" como valor predeterminado
        }

        // Si el campo is_team_event no está proporcionado, le asignamos un valor predeterminado
        if (typeof is_team_event === 'undefined') {
            is_team_event = false; // Asignamos `false` como valor predeterminado para eventos que no son de equipo
        }

        // Asegúrate de que services_array sea un array válido
        if (!Array.isArray(services_array)) {
            services_array = []; // Evita que cause problemas si es null o no es un array
        }

        await connection.beginTransaction();

        let values = [
            event_name, 
            season, 
            sport_name, 
            level_category, 
            gender, 
            time_start, 
            time_end, 
            date_start, 
            date_end, 
            event_address, 
            event_city, 
            event_country, 
            price, 
            is_team_event, 
            check_in, 
            status, 
            description, 
            google_maps_link
        ];
        let string_sql = "INSERT INTO event (event_name, season, sport_name, level_category, gender_category, time_start, time_end, date_start, date_end, event_address, event_city, event_country, price, is_team_event, check_in, status, description, google_maps_link";
        let string_values = '?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?';

        if (req.file) {
            string_sql += ", event_photo";
            string_values += ",?";
            values.push(req.file.filename);
        }

        if (max_participants !== undefined) {
            string_sql += ", max_participants";
            string_values += ",?";
            values.push(max_participants);
        }

        // Si result tiene algún valor, lo agregamos
        if (result) {
            string_sql += ", result";
            string_values += ",?";
            values.push(result);
        }

        // Completamos la consulta SQL
        let sql = `${string_sql}) VALUES (${string_values})`;
       

        let result2 = await connection.query(sql, values);
        let { insertId } = result2[0];

        // Verificamos si hay servicios asociados al evento
        if (services_array.length > 0) {
            for (const service of services_array) {
                let sql2 = `INSERT INTO event_service (service_id, event_id) VALUES (?, ?)`;
                values = [service, insertId];
                await connection.query(sql2, values);
            }
        }

        await connection.commit();
        res.status(200).json({
            success: true,
            message: "Evento creado correctamente"
        });
    } catch (error) {
        await connection.rollback();
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error en la creación del evento",
            result12: error
        });
    } finally {
        connection.release();
    }
}


editEvent = async (req, res) => {
  const connection = await dbPool.getConnection();

  try {

      let parsedData;
      try {
          parsedData = JSON.parse(req.body.data);
      } catch (e) {
          return res.status(400).json({ success: false, message: "JSON inválido en el body" });
      }

      let {
          event_name,
          season,
          sport_name,
          level_category,
          gender_category,
          max_participants,
          time_start,
          time_end,
          date_start,
          date_end,
          event_address,
          event_city,
          event_country,
          price,
          is_team_event,
          check_in,
          status,
          description,
          google_maps_link,
          result,
          services
      } = parsedData;

   

      if (!Array.isArray(services)) {
          return res.status(400).json({ success: false, message: "El campo services_array debe ser un array válido" });
      }

      let { event_id } = req.params;
      event_id = parseInt(event_id);
      if (isNaN(event_id) || event_id <= 0) {
          return res.status(400).json({ success: false, message: "ID del evento inválido" });
      }

      await connection.beginTransaction();

      let values = [
          event_name,
          season,
          sport_name,
          level_category,
          gender_category,
          time_start,
          time_end,
          date_start,
          date_end,
          event_address,
          event_city,
          event_country,
          price,
          is_team_event,
          check_in,
          status,
          description,
          google_maps_link,
      ];

      let string_sql = `
          UPDATE event 
          SET event_name=?, season=?, sport_name=?, level_category=?, gender_category=?, 
              time_start=?, time_end=?, date_start=?, date_end=?, event_address=?, event_city=?, 
              event_country=?, price=?, is_team_event=?, check_in=?, status=?, description=?, google_maps_link=?`;

      if (req.file) {
          string_sql += ", event_photo=?";
          values.push(req.file.filename);
      }
      if (max_participants !== undefined) {
          string_sql += ", max_participants=?";
          values.push(max_participants);
      } else {
          string_sql += ", max_participants=NULL";
      }
      if (result !== undefined) {
          string_sql += ", result=?";
          values.push(result);
      }

      string_sql += " WHERE event_id=?";
      values.push(event_id);

      await connection.query(string_sql, values);

      // Eliminar servicios anteriores con consulta segura
      await connection.query("DELETE FROM event_service WHERE event_id=?", [event_id]);

      // Insertar nuevos servicios
      if (services.length > 0) {
          const serviceValues = services.map(service => [service, event_id]);
          await connection.query("INSERT INTO event_service (service_id, event_id) VALUES ?", [serviceValues]);
      }

      await connection.commit();
      res.status(200).json({
          success: true,
          message: "Evento actualizado correctamente"
      });
  } catch (error) {
      console.error(error);
      await connection.rollback();
      res.status(500).json({
          success: false,
          message: "Error al editar el evento",
          error: error.sqlMessage || error.message
      });
  } finally {
      connection.release();
  }
};



  adminAllUsers = async (req, res) =>{
    
    /**
     *    /admin/AdminAllUsers
     *
     *    INPUT (body): null
     *
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Usuarios extraidos"
     *      - En caso de error:
     *            401 - "No autorizado" ---
     *            500 - "Internal error"
     */

    let sql = "SELECT * FROM user";
    try {
      let result = await executeQuery(sql)
      res.status(200).json({
        success: true,
        message: "Usuarios extraidos correctamente",
        result: result
      })
    }
    catch (error){
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Error al extraer los usuarios",
        result: null
      })
    }
  }

  editUser = async (req, res) => {

    /**
     *    /admin/EditUser/:user_id
     *
     *    INPUT (body): user_name, last_name, phone_number, birth_date, identity_doc, nationality, user_address,
     * zip_code, user_city, province, user_country, gender, avatar, file, is_federated, is_admin, is_verified
     *    
     *
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Usuario editado con éxito"
     *      - En caso de error:
     *            204 - "Hay campos obligatorios vacíos"
     *            401 - "No autorizado" ---
     *            500 - "Internal error"
     */
    
      const {
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
        is_disabled,
        is_verified,
        is_federated,
        is_admin
      } = JSON.parse(req.body.data);

      try {
        let sql = 
          `UPDATE user SET 
          user_name=?,
          last_name=?,
          birth_date=?,
          is_disabled=?,
          is_verified=?,
          is_federated=?,
          is_admin=?`;
        let values = [
          user_name,
          last_name,
          birth_date,
          is_disabled,
          is_verified,
          is_federated,
          is_admin
        ];

        if (phone_number){
          sql += `, phone_number=?`;
          values.push(phone_number);
        }
        if (identity_doc){
          sql += `, identity_doc=?`;
          values.push(identity_doc);
        }
        if (nationality){
          sql += `, nationality=?`;
          values.push(nationality);
        }
        if (user_address){
          sql += `, user_address=?`;
          values.push(user_address);
        }
        if (zip_code){
          sql += `, zip_code=?`;
          values.push(zip_code);
        }
        if (user_city){
          sql += `, user_city=?`;
          values.push(user_city);
        }
        if (province){
          sql += `, province=?`;
          values.push(province);
        }
        if (user_country){
          sql += `, user_country=?`;
          values.push(user_country);
        }
        if (gender){
          sql += `, gender=?`;
          values.push(gender);
        }
        if (req.files && req.files.avatar){
          const avatar = req.files.avatar[0].filename;
          sql += `, avatar=?`;
          values.push(avatar);
        }
        if (req.files && req.files.file){
          const file = req.files.file[0].filename;
          sql += `, file=?`;
          values.push(file);
        }
        sql += ` WHERE user_id=?`;
        values.push(req.params.user_id);
        
        let result = await executeQuery(sql, values);
        
        res.status(200).json({
          success: true,
          message: "Usuario actualizado correctamente"
        });
      }
      catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Error al actualizado el usuario", 
          error
        });
      }
  } 

  deleteUser = async (req, res) =>{

        /**
     *    /admin/DeleteUser/:user_id
     *
     *    INPUT (body): none
     *    
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Usuario eliminado con éxito"
     *      - En caso de error:
     *            401 - "No autorizado" ---
     *            500 - "Error en la eliminación del usuario"
     */

      let {user_id} = req.params;
      user_id = parseInt(user_id);
      
      let sql = "DELETE FROM user WHERE user_id=?";
      let values = [user_id];
      let result = await executeQuery(sql, values);
      
      try {
        res.status(200).json({
          success: true,
          message: "Usuario eliminado con éxito"
        })
      }
      catch (error) {
        res.status(500).json({
          success: false,
          message: "Error en la eliminación del usuario"
        })
      }
  }

  adminOneUser = async(req, res)=>{

    /**
     *    /admin/DeleteUser/:user_id
     *
     *    INPUT (body): none
     *    
     *    OUTPUT:
     *      - En caso de exito: 
     *            200 - "Usuario eliminado con éxito"
     *      - En caso de error:
     *            401 - "No autorizado" ---
     *            500 - "Error en la eliminación del usuario"
     */

    let {user_id} = req.params;
    user_id = parseInt(user_id);
    
    let sql = `SELECT * FROM user WHERE user_id=${user_id}`;
    let result = await executeQuery(sql);

    try {
      res.status(200).json({
        success: true,
        message: "Usuario extraido con éxito",
        result: result
      })  
    } 
    catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al extraer la información del usuario",
        result: null
      })
    }
  }
  
  oneEvent = async(req, res)=>{
    const {id} = req.params;
    try {
      // const values = [id];
      let sql = "SELECT * FROM event WHERE event_id=?";
      const result = await executeQuery(sql, [id]);
      res.status(200).json(result[0]);//=>res.status(200).json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }

  adminSearchUsers = async(req, res)=>{

    let {user_name, last_name, phone_number, email, nationality, identity_doc, gender} = JSON.parse(req.body.data);

    

    try {
      let sql = `SELECT user_name, email, user_photo, is_verified FROM user WHERE user_name LIKE ?`;
      if(user_name){
        user_name = "%" + user_name + "%";
      } else{
        user_name = "%"
      }
      let values = [user_name];
      
      if(last_name){
        sql += " AND last_name LIKE ?";
        values.push(last_name + "%");
      }
      if(phone_number){
        sql += " AND phone_number LIKE ?";
        values.push(phone_number + "%");
      }
      if(email){
        sql += " AND email LIKE ?";
        values.push(email + "%");
      }
      if(nationality){
        sql += " AND nationality LIKE ?";
        values.push(nationality + "%");
      }
      if(identity_doc){
        sql += " AND identity_doc LIKE ?";
        values.push(identity_doc + "%");
      }
      if(gender){
        sql += " AND gender LIKE ?";
        values.push(gender);
      }
     
      
      let result = await executeQuery(sql, values);
      
      
      res.status(200).json({message: "Ok", result: result})  
    } 
    catch (error) {
      console.log(error);
      
      res.status(500).json({message: error})
    }
   }

   eventFilterButton = async(req, res)=>{
   
    let {event_name, gender_category, level_category, status, sport_name, event_country, event_city} = JSON.parse(req.body.data);    

    try {
      let sql = 'SELECT * FROM event WHERE event_name LIKE ?';

      if(event_name){
        event_name = "%" + event_name + "%";
      } else{
        event_name = "%"
      }
      let values = [event_name];      

      if(gender_category){        
        sql += ' AND gender_category LIKE ?';
        values.push(gender_category);
      }
      if(level_category){
        sql += ' AND level_category LIKE ?';
        values.push(level_category);
      }
      if(status){
        if(status == "Estado del evento (todos)"){
          status = null
        } 
        else{
          sql += ' AND status LIKE ?'
          status = parseInt(status);
          values.push(status);
        }
      }
      if(sport_name){
        sql += ' AND sport_name LIKE ?';
        values.push("%" + sport_name + "%");
      }
      if(event_country){
        sql += ' AND event_country LIKE ?';
        values.push("%" + event_country + "%");
      }
      if(event_city){
        sql += ' AND event_city LIKE ?';
        values.push("%"+ event_city + "%");
      }
      sql += " AND is_deleted=0"

      let result = await executeQuery(sql, values);      
      
      res.status(200).json({message: "TODO OK", data: result});
    } 
    catch (error) {
      console.log(error);
      
      res.status(500).json({message: "Error en la solicitud"});
    }
  }

} //Fin del admin.controllers


export default new AdminControllers;