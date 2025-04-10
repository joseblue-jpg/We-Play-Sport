import './adminServiceCard.css'
/* import { fetchData } from '../../helpers/axiosHelper' */
const baseUrl = import.meta.env.VITE_SERVER_URL;

export const AdminServiceCard = ({data, navigate, onDelete}) => {

    return (
        <>
        {data &&
        <div className='adminService-card'>
            <div>{!data.service_photo ? <img src="/images/admin/servicios.jpg" alt="" />:<img src={`${baseUrl}/images/service/${data.service_photo}`}/>}
            </div>
            <div className='adminServiceCard-texts text-center'>
                <h3> {data.service_name} </h3>
            </div>
            <div className='adminServiceCard-btn-div'>
                <button className='adminServiceCard-btn w-50 border-0' onClick={()=>navigate(`/adminEditService/${data.service_id}`)}>Modificar</button>
                <button className='adminServiceCard-delete-btn w-50 border-0' onClick={()=>onDelete(data.service_id)}>Eliminar</button> 
            </div>
        </div>}
        </>
    )
}
