import React, { useContext, useEffect, useState } from 'react';
import './AdminPanelUsers.css';
import { fetchData } from '../../../../helpers/axiosHelper';
import { useNavigate } from 'react-router-dom';
import { AdminUserCard } from '../../../../Components/AdminUserCard/AdminUserCard';
import Swal from 'sweetalert2'
import { KingOfTheCourtContext } from '../../../../Context/ContextProvider';

export const AdminPanelUsers = () => {
  const [users, setUsers] = useState();
  const {token} = useContext(KingOfTheCourtContext);
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    user_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    nationality: "",
    identity_doc: "",
    gender: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {

      try {
        let res = await fetchData(`/admin/AdminAllUsers`, 'get', null, {
          Authorization: `Bearer ${token}`,
        });
        setUsers(res.data.result);
      } 
      catch (error) {
        console.log(error);
      }

    };
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
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
        // Realizar la solicitud de eliminación
        await fetchData(`/admin/DeleteUser/${id}`, 'post', null, {
          Authorization: `Bearer ${token}`,
        });
        
        // Actualizar el estado de usuarios
        setUsers((prevUsers) => prevUsers.filter((elem) => elem.user_id !== id));
        
        // Mostrar mensaje de éxito
        Swal.fire(
          'Eliminado',
          'El usuario ha sido eliminado exitosamente.',
          'success'
        );
      }
    } catch (error) {
      console.log(error);
      // Mostrar mensaje de error
      Swal.fire(
        'Error',
        'No se pudo eliminar el usuario.',
        'error'
      );
    }
  };

  const handleChange =(e)=>{
    let {name, value} = e.target;
    setSearch({...search, [name]:value});
  }

  const onSearch =async(e)=>{
    e.preventDefault();
    
    try {
      let newFormData = new FormData();
      newFormData.append("data", JSON.stringify(search))
      
      let res = await fetchData('/admin/adminSearchUsers', 'post', newFormData, {
        Authorization: `Bearer ${token}`,
      });
      setUsers(res.data.result);
      
      
    } 
    catch (error) {
      console.log(error);
        
    }
  }


  

  return (
    <section className="admin-user-panel d-flex flex-column align-items-center p-5">

      <div className="d-flex justify-content-center">
        <h2 className="title d-flex align-items-center justify-content-center">ADMINISTRACIÓN DE USUARIOS</h2>
        <button className="back-btn fw-bold border-0" onClick={() => navigate('/controlPanel')}>
          VOLVER
        </button>
      </div>

      <div>
        <form className='adminEvent-form d-flex flex-column justify-content-center py-4 px-5 gap-1 m-4 rounded-3'>
          <h2 className='d-flex text-center fs-3 text-white'>BUSCADOR DE USUARIOS</h2>
          <input type="text" name="user_name" placeholder='Nombre' onChange={handleChange} value={search.user_name}/>
          <br />
          <input type="text" name="last_name" placeholder='Apellidos' onChange={handleChange} value={search.last_name}/>
          <br />
          <input type="text" name="email" placeholder='Email' onChange={handleChange} value={search.email}/>
          <br />
          <input type="text" name="phone_number" placeholder='Número de teléfono' onChange={handleChange} value={search.phone_number}/>
          <br />
          <input type="text" name="identity_doc" placeholder='Documento de identidad' onChange={handleChange} value={search.identity_doc}/>
          <br />
          <input type="text" name="nationality" placeholder='Nacionalidad' onChange={handleChange} value={search.nationality}/>
          <br />
          <select onChange={handleChange} name="gender">
            <option value="">Género (cualquiera)</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
          </select>
          <div className='d-flex justify-content-center mt-2'>
            <button className='rounded-3 w-50 border-0' onClick={onSearch} >Buscar</button>
          </div>
        </form>
      </div>

      {/* Verificar si 'users' no está vacío */}
      {!users && <p>Cargando usuarios...</p>}
      {/* Contenedor de tarjetas de usuarios */}
        {users?.map((elem) => {
          return (
            <div className='d-flex m-2' key={elem.user_id}>
              {elem && (
                <AdminUserCard
                  data={elem}
                  navigate={navigate}
                  onDelete={deleteUser}
                />
              )}
            </div>
          );
        })}
    </section>
  );
};
