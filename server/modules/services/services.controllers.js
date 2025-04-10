import executeQuery from "../../config/db.js";

class ServicesControllers {
  //Crear Servicio
  createService = async (req, res) => {
    const {service_name} = JSON.parse(req.body.data);
    
    let sql = "INSERT INTO service (service_name) VALUES (?)";
    try {
      let values = [service_name];
      if(req.file){
        const service_photo = req.file.filename;
        sql = "INSERT INTO service (service_name, service_photo) VALUES (?,?)";
        values = [service_name, service_photo];
      }
      const result = await executeQuery(sql, values);
      res.status(200).json("Servicio creado con exito");
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  }
  //Editar Servicio
  editService = async (req, res) => {
    try {
      const {service_name, service_id} = JSON.parse(req.body.data);


      let sql = "UPDATE service SET service_name=? WHERE service_id = ?";
      let values = [service_name, service_id];
    
      if(req.file){
        const service_photo = req.file.filename;
        
        sql = `UPDATE service SET service_name=?, service_photo=? WHERE service_id=?`;
        values = [service_name, service_photo, service_id];
      }
      const result = await executeQuery(sql, values);
     
      
      res.status(200).json("editServices");
    } catch (error) {
      console.log(error);
      
      res.status(500).json("Error ");
    }
  }

  allServices = async (req, res) => {
    
    try {
      let sql = "SELECT * FROM service";
      const result = await executeQuery(sql);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  serviceById  = async (req, res) => {
    const {service_id} = req.params;
    
    try {
      let sql = "SELECT * FROM service WHERE service_id = ?";
      let values = [service_id];
      const result = await executeQuery(sql, values);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json(error);
    }
  }

  //Borrar Servicio
  delService  = async (req, res) => {
    const {service_id} = req.body;
    
    
    try {
      let sql = "DELETE FROM service WHERE service_id=?";
      let values = [service_id];
      
      const result = await executeQuery(sql, values);

      
      res.status(200).json("delServices");
    } catch (error) {
      res.status(500).json(error);
    }
  }

  searchFilterButton = async (req, res)=>{

    let {service_name} = JSON.parse(req.body.data);      

    try {
      let sql = "SELECT * FROM service WHERE service_name LIKE ?";

      if(service_name){
        service_name = "%" + service_name + "%";
      }
      else {
        service_name = "%";
      }

      let result = await executeQuery(sql, [service_name]);
      res.status(200).json({message: "Todo Ok", result: result})  
    } 
    catch (error) {
      res.status(500).json({messaje: "Error en la solicitud", error})
    }
  }

  servicesEvents = async (req,res) =>{
    let {event_id} = req.params
    event_id = parseInt(event_id)
    try {
      let sql = "SELECT service_id FROM event_service WHERE event_id=?"
      let result= await executeQuery(sql, [event_id]);
      res.status(200).json({message:"OK", result:result})
    } catch (error) {
      res.status(500).json(error);
    }
  }

}

export default new ServicesControllers;