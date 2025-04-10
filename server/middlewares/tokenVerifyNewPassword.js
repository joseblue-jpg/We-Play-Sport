import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const tokenVerifyNewPassword = (req, res, next) => {
  //compruebo si hay token
      const tokenBearer = req.headers.authorization;
      
      if(!tokenBearer){
          res.status(401).json("Credenciales incorrectas")
      }else{
          //comprobar que el token sea válido (que tenga la palabara secreta correcta y que no esté expirado)
          let token = tokenBearer.split(" ")[1]
          if(!token){
              res.status(401).json("Credenciales incorrectas");
          }else{
              jwt.verify(token, process.env.TOKEN_KEY_NEW_PASSWORD, (err, decoded)=>{
                  if(err){
                      res.status(401).json("Credenciales incorrectas")
                  }else{
                      
                      req.email = decoded.email
                      next();
                  }
              } )
             
          }
      }
}
