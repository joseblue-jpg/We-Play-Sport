import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();

export const tokenVerifyTeamInscription = (req, res, next) => {

    const tokenBearer = req.headers.authorization;

    if(!tokenBearer){
        res.status(401).json({message: "Credenciales incorrectas"});
    }
    else{
        let token = tokenBearer.split(" ")[1]
        if(!token){
            res.status(401).json({message: "Credenciales incorrectas"});
        }
        else{
            jwt.verify(token, process.env.TOKEN_KEY_INVITATION, (err, decoded)=>{
                if(err){
                    res.status(401).json({message: "Credenciales incorrectas"});
                }
                else{
                    req.email = decoded.email;
                    req.team_id = decoded.team_id;
              
                    
                    req.event_id = decoded.event_id;
                    next();
                }
            })
          
        }
    }
    
}