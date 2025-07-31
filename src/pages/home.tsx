import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth/useAuth';
import {Link} from 'react-router-dom';

interface Reminder {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
}
interface User{
  _id: string;
  userName: string;
}

function HomePage(){
  const {currentUser} = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchUserAndReminders = async() => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getuserByFirebaseUid/${currentUser?.uid}`);
        const mongoUserId = userRes.data.data._id;
        setUserData(userRes.data.data);

        const reminderRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getUpcomingReminders/${mongoUserId}`);
        setReminders(reminderRes.data.data);
      }catch(error){
        console.error('Error al cargar los datos del usuario o recordatorios por vencer.🔴', error);
        alert('Error al cargar la informacion. Por favor, inténtalo de nuevo más tarde.🔴');
      }finally {
        setLoading(false);
      }
    };
    if(currentUser?.uid) {
      fetchUserAndReminders();
    }
  },[currentUser]);
  if(loading){
    return <div className='container mt-4'>Cargando próximos recordatorios...</div>;
  }
  return (
    <div className='container mt-4 homepage-container'>
      <div className='mb-4'>
        <h1>Bienvenido{userData ? `, ${userData.userName}` : ''} 👋</h1>
      </div>
       <div className='mb-5 p-3 rounded tutorial-box shadow-sm'>
        <h3>📌 ¿Cómo usar la app?</h3>
        <ul className='mb-0'>
          <li>Haz clic en <strong>'Crear Recordatorio'</strong> para agendar una nueva tarea.</li>
          <li>Puedes editar, archivar o compartir tus recordatorios desde la sección 'Mis Recordatorios'.</li>
          <li>Consulta aquí los próximos recordatorios que están por vencer.</li>
        </ul>
        <div className='mt-auto d-flex justify-content-center mt-3'>
          <Link to='/createReminder' className='btn btn-custom'>Crear Recordatorio</Link>
        </div>
      </div>
      <div className='mb-4'>
        <h2>Recordatorios próximos a vencer</h2>
      </div>
      {reminders.length === 0 ? (
        <p className='text-center no-reminders'>No hay recordatorios próximos a vencer.</p>
      ) : (
        <div className='row justify-content-around'>
          {reminders.map((reminder) => (
            <div key={reminder._id} className='col-md-4 mb-3'>
              <div className='card reminder-card h-100 shadow-sm'>
                <div className='card-body d-flex flex-column justify-content-between'>
                  <h5 className='card-title'>{reminder.title}</h5>
                  <p className='card-text'>{reminder.description}</p>
                  <p className='card-text'><strong>Tipo:</strong> {reminder.type}</p>
                  {reminder.dueDate && (<p className='card-text'><strong>Vence:</strong> {reminder.dueDate?.substring(0, 10).split('-').reverse().join('/')}</p>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;