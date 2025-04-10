import { ZodError } from "zod";

export const validateForms =(schema)=>(req, res, next)=>{
   
    try {
        // Este if indica si viene de un formulario con input tipo file y los datos vienen en forma de JSON
        if(req.body.data){
            schema.parse(JSON.parse(req.body.data))
        }else{
            schema.parse(req.body);
        }
        
        next();
    } 
    catch (error) {
       
        
        if(error instanceof ZodError){
            return res.status(500).json({
                error: error.errors.map((err)=>({
                    path: err.path[0],
                    message: err.message,
                }))
            })
        }
    }

}
