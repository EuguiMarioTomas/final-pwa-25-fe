import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/auth/useAuth';

interface Reminder{
  _id:string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
}

function MyArchivedReminders(){
  const {currentUser} = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    const fetchReminders = async() =>{
      try{
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getuserByFirebaseUid/${currentUser?.uid}`);
        const mongoUserId = userRes.data.data._id;

        const reminderRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getArchivedRemindersByAuthor/${mongoUserId}`);
        setReminders(reminderRes.data.data)
      }catch(error){
        console.error('Error al cargas los recordatorios archivados.🔴', error);
        alert('Error al cargar los recordatorios archivador. Por favor, inténtalo de nuevo más tarde.🔴');
      }finally{
        setLoading(false);
      }
    };
    if(currentUser?.uid){
      fetchReminders();
    }
  },[currentUser]);
  const handleArchive = async(reminderId: string) =>{
    const confirmArchive = confirm('¿Estas seguro que deseas desarchivar el recordatorio?🟡');
    if(!confirmArchive) return;
    try{
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/reminders/softDeleteReminder/${reminderId}`);
      setReminders(reminders.filter(r => r._id !== reminderId));
    }catch(error){
      console.error('Error al desarchivar el recordatorio.🔴', error);
      alert('No se pudo desarchivar el recordatorio.🔴')
    }
  };
  if(loading){
    return <div className='container mt-4'>Cargando recordatorios archivados...</div>;
  }
  return(
    <div className='container'>
      <h1 className='mt-4'>Mis Recordatorios Archivados</h1>
      {reminders.length === 0 ? (
        <p>No tienes recordatorios archivados.</p>
      ) : (
        <div className='row justify-content-around'>
          {reminders.map((reminder) => (
            <div key={reminder._id} className='col-md-4 mb-3'>
              <div className='card h-100'>
                <div className='card-body'>
                  <h2 className='card-title'>{reminder.title}</h2>
                  <p className='card-text'>{reminder.description}</p>
                  <p className='card-text'><strong>Tipo:</strong> {reminder.type}</p>
                  {reminder.dueDate && (<p className='card-text'><strong>Vence:</strong> {new Date(reminder.dueDate).toLocaleDateString()}</p>)}
                  <div className='d-flex justify-content-between mt-3'>
                    <button className='btn btn-sm btn-outline-primary' onClick={() => handleArchive(reminder._id)}>Desarchivar</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyArchivedReminders;