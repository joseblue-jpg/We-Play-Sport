import React, { useContext, useEffect, useState } from 'react'
import "./AdminPanelEvents.css"
import { fetchData } from '../../../../helpers/axiosHelper'
import { useNavigate } from 'react-router-dom'
import { AdminEventCard } from '../../../../Components/AdminEventCard/AdminEventCard';
import Swal from 'sweetalert2'
import { KingOfTheCourtContext } from '../../../../Context/ContextProvider';

export const AdminPanelEvents = () => {
      const[data, setData] = useState();
      const navigate = useNavigate();
      const { token } = useContext(KingOfTheCourtContext);
      const [searchSelection, setSearchSelection] = useState({
        gender_category: "",
        level_category: "",
        event_name: "",
        status: null,
        sport_name: "",
        event_country: "",
        event_city: ""
      });
      

      useEffect(()=>{
        const fetchEvents = async() =>{
            let temp = await fetchData(`/admin/AdminAllEvents`, "get", null, {
              Authorization: `Bearer ${token}`,
            })
            setData(temp.data.result);
        }
        fetchEvents();
      },[])

      const deleteEvent = async(id)=>{
        try {
          const result = await Swal.fire({
              title: '¿Estás seguro?',
              text: "No podrás revertir esta acción",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sí, eliminar',
              cancelButtonText: 'Cancelar'
          });
  
          if (result.isConfirmed) {
              await fetchData(`/admin/DeleteEvent/${id}`, 'post', null, {
                Authorization: `Bearer ${token}`,
              });
              setData((prevValue)=>(prevValue.filter((elem)=>elem.event_id !== id)));
              
              Swal.fire(
                  'Eliminado',
                  'El evento ha sido eliminado exitosamente.',
                  'success'
              );
          }
        }
          catch (error) {
              console.log(error);
              Swal.fire(
                  'Error',
                  'No se pudo eliminar el evento.',
                  'error'
              );
          }
      }
      const handleChange =(e)=>{
        let {name, value} = e.target
        setSearchSelection({...searchSelection, [name]:value});
      };
      const onSubmit =async(e)=>{
          e.preventDefault();
          try {
              let newFormData = new FormData();

              newFormData.append("data", JSON.stringify(searchSelection));
              
              let res = await fetchData('/admin/eventFilterButton', 'post', newFormData, {
                Authorization: `Bearer ${token}`,
              });
              setData(res.data.data)
          }
          catch (error) {
              console.log(error);
          }
        };
  return (
   <section className='adminPanelEvents-ppal d-flex flex-column align-items-center p-5'>
     <h2 className='title d-flex rounded-2 fs-4 justify-content-center align-items-center'>ADMINISTRACIÓN DE EVENTOS</h2>
     <div className='adminEventPanel-btns d-flex justify-content-center '>
        <button className='create-event w-50 fw-bold rounded-2 border-0' onClick={()=>navigate('/adminCreateEvent')} >CREAR EVENTO</button>
        <button className='back w-50 fw-bold rounded-2 border-0' onClick={()=>navigate('/controlPanel')} > VOLVER </button>
    </div>
      <form className='adminEvent-form d-flex flex-column justify-content-center py-3 px-4 gap-3 m-4 rounded-3'>
        <h2 className='d-flex justify-content-center fs-2 text-white'>BUSCADOR DE EVENTOS</h2>
        <div className='input-container d-flex gap-3'>
          <div className='d-flex flex-column justify-content-center gap-2'>
            <input type="text" name='event_name' placeholder='Nombre del evento' onChange={handleChange} />
            <input type="text" name='sport_name' placeholder='Deporte' onChange={handleChange} />
            <input type="text" name='event_country' placeholder='País' onChange={handleChange} />
            <input type="text" name='event_city' placeholder='Ciudad' onChange={handleChange} />
          </div>
          <div className='event-select d-flex flex-column justify-content-center gap-3'>
              <select name='gender_category' onChange={handleChange}>
                      <option value="">Categoría de género (todas)</option>
                      <option value="masculino">Masculino</option>
                      <option value="femenino">Femenino</option>
                      <option value="mixto">Mixto</option>
              </select>
              <select name='level_category' onChange={handleChange}>
                      <option value="">Categoría profesional (todas)</option>
                      <option value="gold">Oro</option>
                      <option value="silver">Plata</option>
                      <option value="bronze">Bronce</option>
              </select>
              <select name='status' onChange={handleChange}>
                      <option value={null}>Estado del evento (todos)</option>
                      <option value={1}>Próximamente</option>
                      <option value={2}>Activo</option>
                      <option value={3}>Inscripción cerrada</option>
                      <option value={4}>Cancelado</option>
                      <option value={5}>Pasado</option>
              </select>
              <div className='d-flex justify-content-center'>
                <button className='rounded-3 w-50 border-0' onClick={onSubmit} >Buscar</button>
              </div>
          </div>
        </div>
      </form>
    <div className="admin-panel-events d-flex justify-content-center flex-wrap gap-3">
      {data?.map((elem) => {
        return (
          <AdminEventCard
          key={elem.event_id}
            data={elem}
            navigate={navigate}
            onDelete={deleteEvent}
            />
        )
      })}
    </div>
      {data?.length === 0 &&
      <p>No existen eventos con esas características</p> }
   </section>
  )
}
