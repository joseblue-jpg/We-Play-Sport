import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async ({ email, user_name, last_name, token, typeEmail }) => {
  let mensajeHtml = "";
  let subject = "";

  // ----------------- CORREO DE VERIFICAR LA CUENTA, OSEA, PARA PODER LOGUEARSE ---------------------

  if (typeEmail === "confirmUser") {
    mensajeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a WEPLAY</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <!-- Contenedor principal -->
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Cabecera -->
        <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #4a6bff; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 60px;">WE PLAY</h1>
                <p style="margin: 0; color: white; font-size: 24px;">Sports Experiencies</p>
            </td>
        </tr>
        
        <!-- Contenido -->
        <tr>
            <td style="padding: 30px;">
                <p style="margin: 0 0 20px; color: #333333; font-size: 20px; line-height: 1.5;">
                    ¡Bienvenido ${user_name} ${last_name}!
                </p>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Gracias por registrarte en nuestra aplicación  ${user_name} ${last_name}. Estamos emocionados de tenerte con nosotros.
                </p>
                
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    <strong>Email:</strong> ${email}
                </p>
                
                <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Por favor confirma tu registro haciendo clic en el siguiente botón:
                </p>
                
                <!-- Botón de confirmación -->
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <a href="${process.env.HOST_FRONT}/confirmRegister/${token}" 
                               style="display: inline-block; padding: 12px 30px; background-color: #4a6bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                                Confirmar registro
                            </a>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 30px 0 0; color: #777777; font-size: 14px; line-height: 1.5;">
                    Si no has sido tú quien ha solicitado este registro, por favor ignora este mensaje.
                </p>
            </td>
        </tr>
        
        <!-- Pie de página -->
        <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #999999; font-size: 12px;">
                    © 2025 WEPLAY. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
subject = "Bienvenido a WEPLAY";

        // ----------------- CORREO RECUPERAR LA CONTRASEÑA ---------------------

  } else if (typeEmail === "forgotPassword"){
    mensajeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a WEPLAY</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <!-- Contenedor principal -->
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Cabecera -->
        <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #4a6bff; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 60px;">WE PLAY</h1>
                <p style="margin: 0; color: white; font-size: 24px;">Sports Experiencies</p>
            </td>
        </tr>
        
        <!-- Contenido -->
        <tr>
            <td style="padding: 30px;">
                <p style="margin: 0 0 20px; color: #333333; font-size: 20px; line-height: 1.5;">
                    ¡Hola jugador!
                </p>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Hemos recibido una solicitud para restablecer la contraseña de tu cuenta de We Play Sports Experience. Si no fuiste tú, ignora este mensaje.
                </p>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Para crear una nueva contraseña, haz clic en el siguiente enlace:
                </p>

                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <a href="${process.env.HOST_FRONT}/forgotPassword/newPassword/${token}" style="display: inline-block; padding: 12px 30px; background-color: #4a6bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">Recuperar la contraseña</a>
                        </td>
                    </tr>
                </table>
                
                <br>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    El enlace es de uso único y caducará después de su uso o al pasar el tiempo límite.
                </p>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Recuerda, NUNCA compartas tu contraseña.
                </p>
                <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Gracias,
                    El equipo de We Play Sports Experience.
                </p>    
                
                <!-- Botón de confirmación -->
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <a href="${process.env.HOST_FRONT}/confirmRegister/${token}" 
                               style="display: inline-block; padding: 12px 30px; background-color: #4a6bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                                Confirmar registro
                            </a>
                        </td>
                    </tr>
                </table>
                
                <p style="margin: 30px 0 0; color: #777777; font-size: 14px; line-height: 1.5;">
                    Si no has sido tú quien ha solicitado el cambio de contraseña, ignora este mensaje.
                </p>
            </td>
        </tr>
        
        <!-- Pie de página -->
        <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #999999; font-size: 12px;">
                    © 2025 WEPLAY. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`;
subject = "WEPLAY Restablecer contraseña";

        // ----------------- CORREO ACEPTAR LA INVITACION A UN EVENTO ---------------------

  }
  else if(typeEmail === "invitationEmail"){
    mensajeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>¡Invitación aceptada! | WEPLAY</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
    <!-- Contenedor principal -->
    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <!-- Cabecera -->
        <tr>
            <td style="padding: 30px 30px 20px; text-align: center; background-color: #4a6bff; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; color: white; font-size: 60px;">WE PLAY</h1>
                <p style="margin: 0; color: white; font-size: 24px;">Sports Experiences</p>
            </td>
        </tr>
        
        <!-- Contenido -->
        <tr>
            <td style="padding: 30px;">
                <p style="margin: 0 0 20px; color: #333333; font-size: 20px; line-height: 1.5;">
                    ¡Hola jugador!
                </p>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    Acabas de recibir una invitación para unirte a un evento. Recuerda de tienes un máximo de 2 días, desde que se ha enviado este email, para aceptar 
                </p>
                
                <!-- Botón para ver detalles -->
                <table width="100%" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center">
                            <a href="${process.env.HOST_FRONT}/acceptInvitation/${token}" 
                               style="display: inline-block; padding: 12px 30px; background-color: #4a6bff; color: white; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 16px;">
                                Ver detalles del evento
                            </a>
                        </td>
                    </tr>
                </table>
                <br><br>
                <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.5;">
                    ¡Prepárate para vivir una experiencia increíble!
                </p>
                
                <p style="margin: 0; color: #333333; font-size: 16px; line-height: 1.5;">
                    ¡Nos vemos en la cancha!<br>
                    <strong>El equipo de We Play</strong>
                </p>
            </td>
        </tr>
        
        <!-- Pie de página -->
        <tr>
            <td style="padding: 20px 30px; text-align: center; background-color: #f8f8f8; border-radius: 0 0 8px 8px;">
                <p style="margin: 0; color: #999999; font-size: 12px;">
                    © 2025 WEPLAY. Todos los derechos reservados.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>`
      subject = "WEPLAY Invitación a evento";
  }

  try {
    let prueba = await transporter.sendMail({
      from: ' "WEPLAY" <teresaoggar@gmail.com>',
      to: email,
      subject: subject,
      html: mensajeHtml,
    });
    
  } catch (error) {
    throw error;
  }
};

export default sendMail;
