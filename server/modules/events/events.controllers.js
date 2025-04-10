import executeQuery, { dbPool } from "../../config/db.js";

class EventsControllers {

  allEvents = async (req, res) => {
    try {
      let sql = "SELECT * FROM event WHERE is_deleted = 0 ORDER BY status, date_start";
      const result = await executeQuery(sql);

      res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json("error events");
    }
  }

  allEventsHome = async (req, res) => {
    try {
      let sql = "SELECT * FROM event WHERE is_deleted = 0 AND status!=4 AND status!=5 ORDER BY status, date_start";
      const result = await executeQuery(sql);
      
      
      res.status(200).json({success: true, result: result})
    } catch (error) {
      console.log(error);
      res.status(500).json({success: false, error});
    }
  }

  oneEvent = async(req, res)=>{
    const {id} = req.params;
    
    try {
      // const values = [id];
      let sql = "SELECT * FROM event WHERE event_id=? AND is_deleted=0";
      const result = await executeQuery(sql, [id]);
      res.status(200).json(result[0]);//=>res.status(200).json(result[0]);
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
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
        values.push("%" + event_city + "%");
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

  getServicesFromAnEvent = async(req, res)=>{
    const {event_id} = req.params;    
    
    try {

      //1ºExtraer los id de los servicios
      let sql_services_id = 'SELECT service_id FROM event_service WHERE event_id=?';
      let result_services_id = await executeQuery(sql_services_id, [event_id]);

      //CASO ERROR: cuando no hay servicios en el evento
      if(result_services_id.length === 0){
        return res.status(200).json({success: true, result: []})
      }
      
      //2º Extraer los nombres de los servicios
      let sql_services_name = 'SELECT service_name FROM service WHERE service_id IN ('
      let values_services_name = [];

      for(let service of result_services_id){
        sql_services_name += '?,'
        values_services_name.push(service.service_id)
      }
      sql_services_name = sql_services_name.slice(0, -1);
      sql_services_name += ')';
      let result_services_name = await executeQuery(sql_services_name, values_services_name);

      //3º Mandar la información limpia
      let data = []
      for(let service of result_services_name){
        data.push(service.service_name)
      }  
    
      res.status(200).json({success: true, result: data});
    } 
    catch (error) {
      console.log(error);
      
      res.status(500).json({success: false, error});
    }
  }

  eventIsFull = async(req, res) =>{

    let {event_id} = req.params;    
    


    try {
      //Extraer el max_participants
      let sql_max_participants = 'SELECT max_participants FROM event WHERE event_id=?';
      let result_max_participants = await executeQuery(sql_max_participants, [event_id]);
      let max_participants = result_max_participants[0].max_participants;
      

      //Para saber cuantos equipos hay registrados
      let sql_obtain_participants = 'SELECT count(team_id) as registered_participants FROM registration WHERE event_id=?';
      let values = [event_id, max_participants];
      let result = await executeQuery(sql_obtain_participants, values);



      if(result[0].registered_participants >= max_participants){
        let sql_change_state = 'UPDATE event SET status=3 WHERE event_id=?';
    
        let result_change_state = await executeQuery(sql_change_state, [event_id]);

        return res.status(200).json({success: true, message:`Ha cambiado el evento ${event_id}`})
      }

      res.status(200).json({success: true, message:"No ha cambiado nada"})



    }
    catch (error) {
      console.log(error);
      
      res.status(500).json({success: false, error});
    }
  };

  setEventsDone = async (req, res)=>{

    const connection = await dbPool.getConnection();
    try {
      //1º Extraer los eventos que ya han ocurrido
      let sql_eventos_ocurridos = `SELECT event_id FROM event WHERE date_end < curdate()`;
      let result_eventos_ocurridos = await connection.query(sql_eventos_ocurridos);
      
      
      //2º Cambiarles el estado a done
      for(let event of result_eventos_ocurridos[0]){
      
        let sql = 'UPDATE event SET status=5 WHERE event_id=?'
        await connection.query(sql, [event.event_id])
      }
      
      await connection.commit();      
      res.status(200).json({success: true});
    } 
    catch (error) {
      console.log(error);
      
      await connection.rollback();
      res.status(500).json({error});
    }
    finally{
      connection.release();
    }
  }
}

export default new EventsControllers;