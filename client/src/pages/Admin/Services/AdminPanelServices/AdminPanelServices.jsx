import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { fetchData } from '../../../../helpers/axiosHelper';
import { AdminServiceCard } from '../../../../Components/AdminServiceCard copy/AdminServiceCard';
import { KingOfTheCourtContext } from '../../../../Context/ContextProvider';
import './adminPanelServices.css'
import Swal from 'sweetalert2'

const BackUrl = import.meta.env.VITE_SERVER_URL;

export const AdminPanelServices = () => {

  const [services, setServices] = useState();
  const {token} = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    service_name: ""
  });
  

  useEffect(()=>{
    const fetchServices = async () =>{
      try {
        let res = await fetchData('/services/allServices', "get", null, {
          Authorization: `Bearer ${token}`,
        });
        
        setServices(res.data);
       /*  setToken(tokenLocal); */

      } catch (error) {
        console.log(error);
      }
    }
    fetchServices();
  },[]);

  
  const onDelete = async (id)=>{//Ponerle token*
    
    try {
      // Mostrar cuadro de diálogo de confirmación con Sweet Alert
      const result = await Swal.fire({
        title: '¿Estás seguro?', // Título de confirmación
        text: 'No podrás revertir esta acción', // Mensaje de advertencia
        icon: 'warning', // Ícono de advertencia
        showCancelButton: true, // Mostrar botón de cancelar
        confirmButtonColor: '#3085d6', // Color del botón de confirmación
        cancelButtonColor: '#d33', // Color del botón de cancelación
        confirmButtonText: 'Sí, eliminar', // Texto del botón de confirmación
        cancelButtonText: 'Cancelar' // Texto del botón de cancelación
      });
  
      // Verificar si el usuario confirmó la eliminación
      if (result.isConfirmed) {
        // Realizar solicitud de eliminación enviando token de autorización
        await fetchData(
          '/services/delService', 
          "delete", 
          { service_id: id }, // Parámetros de la solicitud
          { Authorization: `Bearer ${token}` } // Cabecera de autorización con token
        );
  
        // Actualizar el estado de servicios 
        // Filtrar para mantener solo los servicios cuyo ID sea diferente al eliminado
        setServices(services.filter((elem) => elem.service_id !== id));
  
        // Mostrar mensaje de éxito con Sweet Alert
        Swal.fire(
          'Eliminado',
          'El servicio ha sido eliminado exitosamente.',
          'success'
        );
      }
    } catch (error) {
      // Registrar error en la consola
      console.log(error);
  
      // Mostrar mensaje de error con Sweet Alert
      Swal.fire(
        'Error',
        'No se pudo eliminar el servicio.',
        'error'
      );
    }
  }

  const handleChange =(e)=>{
    let {name, value} = e.target;
    setSearch({...search, [name]:value});
  }

  const onSearch =async(e)=>{
      e.preventDefault();
      
      try {
        let newFormData = new FormData();
        newFormData.append("data", JSON.stringify(search))
        
        let res = await fetchData('/services/servicesSearchButton', 'post', newFormData, {
          Authorization: `Bearer ${token}`,
        });
        setServices(res.data.result);
        
      } 
      catch (error) {
        console.log(error); 
      }
    }
    

  return (
    <section className='adminPanelEvents-ppal d-flex flex-column align-items-center p-5'>
      <h2 className='title d-flex rounded-2 fs-4 justify-content-center align-items-center'>ADMINISTRACIÓN DE SERVICIOS</h2>
      <div className='adminEventPanel-btns d-flex justify-content-between mb-4'>
        <button className='create-event w-50 fw-bold rounded-2 border-0' onClick={()=>navigate('/adminCreateService')} >CREAR SERVICIO</button>
        <button className='back w-50 fw-bold rounded-2 border-0' onClick={()=>navigate('/controlPanel')} > VOLVER </button>
      </div>

      <div>
        <form className='service-search d-flex flex-column text-center rounded-3 m-3 p-3 gap-3'>
         <h3 className='fs-4 text-white'>BUSCADOR DE SERVICIOS</h3>
          <div className='d-flex justify-content-center align-items-center'>
            <input type="text" name="service_name" placeholder='Nombre del servicio' onChange={handleChange} value={search.service_name}/>
            <br />
            <button className='border-0 px-2' onClick={onSearch} >BUSCAR</button>
          </div>
        </form>
      </div>

        <div className='adminPanel-services d-flex justify-content-center flex-wrap'>
          {services?.map((elem)=>{
            return(
              <AdminServiceCard key={elem.service_id} data={elem} navigate={navigate} setServices={setServices} onDelete={onDelete}/>
            )
          })}
        </div>
    </section>
  )
}
