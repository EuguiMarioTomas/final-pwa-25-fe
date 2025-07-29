import {useEffect, useState} from 'react';
import axios from 'axios';
import {useAuth} from '../../context/auth/useAuth';
import {useNavigate} from 'react-router-dom';


import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
}


function MyReminders() {
  const {currentUser} = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() =>{
    const fetchReminders = async() => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getuserByFirebaseUid/${currentUser?.uid}`);
        const mongoUserId = userRes.data.data._id;

        const reminderRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getRemindersByAuthor/${mongoUserId}`);
        setReminders(reminderRes.data.data);
      }catch(error){
        console.error('Error al cargar los recordatorios.🔴', error);
        alert('Error al cargar los recordatorios. Por favor, inténtalo de nuevo más tarde.🔴');
      }finally {
        setLoading(false);
      }
    };
    if(currentUser?.uid) {
      fetchReminders();
    }
  },[currentUser]);

  const handleShareReminder = async(reminderId: string)=>{
    const emailToShare = prompt('Ingrese el email del usuario con el que desea compartir.');
    if(!emailToShare) return;
    try{
      const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserByEmail/${emailToShare}`);
      const userId = userRes.data.data._id;

      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/reminders/sharedReminder/${reminderId}`, { userId });
      alert('Recordatorio compartido exitosamente.');
    } catch(error) {
      console.error('Error al compartir el recordatorio.🔴', error);
      alert('No se pudo compartir el recordatorio.🔴');
    }
  };
  const handleArchive = async(reminderId: string) =>{
    const confirmArchive = confirm('¿Estas seguro que deseas archivar el recordatorio?🟡');
    if(!confirmArchive) return;
    try{
      await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/reminders/softDeleteReminder/${reminderId}`);
      setReminders(reminders.filter(r => r._id !== reminderId));
    }catch(error){
      console.error('Error al archivar el recordatorio.🔴', error);
      alert('No se pudo archivar el recordatorio.🔴')
    }
  };
  const handleEdit = (reminderId: string) =>{
    navigate(`/editReminder/${reminderId}`);
  };
  if(loading){
    return <div className='container mt-4'>Cargando recordatorios...</div>;
  }

  return(
    <div className='container'>
      <h1 className='mt-4'>Mis Recordatorios</h1>
      {reminders.length === 0 ? (
        <p>No tienes recordatorios.</p>
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
                    <button className='btn btn-sm btn-outline-primary' onClick={() => handleEdit(reminder._id)}>Editar</button>
                    <button className='btn btn-sm btn-outline-primary' onClick={() => handleShareReminder(reminder._id)}>Compartir</button>
                    <button className='btn btn-sm btn-outline-primary' onClick={() => handleArchive(reminder._id)}>Archivar</button>
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
export default MyReminders;
