import './adminUserCard.css'

export const AdminUserCard = ({data, navigate, onDelete}) => {

  return (
    <div className='adminUser-card d-flex'>

        <div className='user-name w-75 p-2'>
          <h3 className='h-50'>{data.user_name} {data.last_name}</h3>
          <h3 className='h-50'> {data.email} </h3>
        </div>

        <div className='d-flex flex-column align-items-end w-25'>

          <button className='adminUserCard-btn modify w-100 h-50' onClick={()=>navigate(`/adminEditUser/${data.user_id}`)}>MODIFICAR
          </button>

          <button className='adminUserCard-btn delete w-100 h-50' onClick={()=>onDelete(data.user_id)}>ELIMINAR
          </button> 

        </div>
    </div>
  )
}
