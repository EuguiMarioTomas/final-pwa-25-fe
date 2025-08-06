import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth/useAuth';

interface Reminder{
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
  author?: {
    userName: string;
    email: string;
  };
}

function SharedReminders(){
  const {currentUser} = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchSharedReminders = async() =>{
      try{
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getuserByFirebaseUid/${currentUser?.uid}`);
        const mongoUserId = userRes.data.data._id;

        const sharedRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getSharedReminders/${mongoUserId}`);
        setReminders(sharedRes.data.data);
      }catch(error){
        console.error('Error al obtener recordatorios compartidos:', error);
        alert('Error al cargar los recordatorios compartidos.🔴');
      }finally{
        setLoading(false);
      }
    };

    if(currentUser?.uid){
      fetchSharedReminders();
    }
  },[currentUser]);
  if(loading){
    return <div className='container mt-4'>Cargando recordatorios compartidos...</div>
  }

  return(
    <div className='container shared-reminders-container mt-5'>
      <h1 className='mt-1 shared-reminders-title'>Recordatorios compartidos contigo</h1>
      <h2>👥</h2>
      {reminders.length === 0 ?(
        <p className='text-center no-reminders'>No tienes recordatorios compartidos.</p>
      ):(
        <div className='row justify-content-around'>
          {reminders.map((reminder) =>(
            <div key={reminder._id} className='col-md-4 mb-3'>
              <div className='card h-100 shared-reminder-card'>
                <div className='card-body d-flex flex-column'>
                  <h2 className='card-title'>{reminder.title}</h2>
                  <p className='card-text'>{reminder.description}</p>
                  <p className='card-text'><strong>Tipo: </strong>{reminder.type}</p>
                  {reminder.dueDate && (
                    <p className='card-text'><strong>Vence: </strong> {new Date(reminder.dueDate).toLocaleDateString()}</p>
                  )}
                  {reminder.author &&(
                    <p className='card-text mt-auto'><strong>Autor: </strong>{reminder.author.userName} ({reminder.author.email})</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SharedReminders;