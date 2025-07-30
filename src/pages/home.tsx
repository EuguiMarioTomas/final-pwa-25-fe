import { useEffect, useState } from "react";
import axios from 'axios';
import { useAuth } from "../context/auth/useAuth";

interface Reminder {
  _id: string;
  title: string;
  description: string;
  type: string;
  dueDate?: string;
}

function HomePage(){
  const {currentUser} = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchUpcomingReminders = async() => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getuserByFirebaseUid/${currentUser?.uid}`);
        const mongoUserId = userRes.data.data._id;

        const reminderRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getUpcomingReminders/${mongoUserId}`);
        console.log('Recordatorios desde el backend: ', reminderRes.data.data); //BORRAR UNA VEZ APAREZCAN LOS PROXIMOS A VENCER
        setReminders(reminderRes.data.data);
      }catch(error){
        console.error('Error al cargar los recordatorios por vencer.🔴', error);
        alert('Error al cargar los recordatorios por vencer. Por favor, inténtalo de nuevo más tarde.🔴');
      }finally {
        setLoading(false);
      }
    };
    if(currentUser?.uid) {
      fetchUpcomingReminders();
    }
  },[currentUser]);
  if(loading){
    return <div className="container mt-4">Cargando próximos recordatorios...</div>;
  }
  return (
    <div className="container mt-4">
      <div className="d-flex row">
        <h1 className="d-flex justify-content-center mb-4">Recordatorios</h1>
        <h2 className="d-flex justify-content-center mb-4">Recordatorios próximos a vencer</h2>
      </div>
      {reminders.length === 0 ? (
        <p>No hay recordatorios próximos a vencer.</p>
      ) : (
        <div className="row justify-content-around">
          {reminders.map((reminder) => (
            <div key={reminder._id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{reminder.title}</h5>
                  <p className="card-text">{reminder.description}</p>
                  <p className="card-text"><strong>Tipo:</strong> {reminder.type}</p>
                  {reminder.dueDate && (<p className="card-text"><strong>Vence:</strong> {reminder.dueDate?.substring(0, 10).split('-').reverse().join('/')}</p>)}
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