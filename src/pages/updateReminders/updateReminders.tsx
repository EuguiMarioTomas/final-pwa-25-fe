import {useEffect, useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface ReminderFormData{
  title: string;
  description: string;
  type: 'Pendiente' |'Evento' | 'Idea' | 'Otro';
  dueDate?: Date;
}

function EditReminder(){
  const {reminderId} = useParams();
  const navigate = useNavigate();
  const {register, handleSubmit, reset, formState:{errors}} = useForm<ReminderFormData>();
  const [loading, setLoading] = useState(true);

  useEffect(() =>{
    const fetchReminder = async() =>{
      try{
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/reminders/getReminderById/${reminderId}`);
        const reminder = response.data.data;
        reset({
          title: reminder.title,
          description: reminder.description,
          type: reminder.type,
          dueDate: reminder.dueDate?.split('T')[0], //Formato yyyy-mm-dd
        });
      }catch(error){
        console.error('Error al cargar recordatorio.🔴', error);
        alert('No se pudo cargar el recordatorio.🔴');
        navigate('/myReminders');
      }finally{
        setLoading(false);
      }
    };
    if(reminderId)fetchReminder();
  },[reminderId, reset, navigate]);

  const onSubmit = async (data:ReminderFormData) =>{
    try{
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/reminders/updateReminder/${reminderId}`, data);
      alert('Recordatorio actualizado correctamente.🟢');
      navigate('/myReminders');
    }catch(error){
      console.error('Error al actualizar el recordatorio.🔴', error);
      alert('Error al actualizar el recordatorio.🔴');
    }
  };
  if(loading) return <div className="container mt-4">Cargando recordatorio...</div>;
  return (
    <div className="container">
      <h1>Editar Recordatorio</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Título</label>
          <input className="form-control" {...register("title", { required: true })} />
          {errors.title && <span className="text-danger">El título es obligatorio.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea className="form-control" rows={3}{...register("description", { required: true })} />
          {errors.description && <span className="text-danger">La descripción es obligatoria.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select className="form-select" {...register("type", { required: true })}>
            <option value="Pendiente">Pendiente</option>
            <option value="Evento">Evento</option>
            <option value="Idea">Idea</option>
            <option value="Otro">Otro</option>
          </select>
          {errors.type && <span className="text-danger">El tipo es obligatorio.</span>}
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de vencimiento</label>
          <input className="form-control" type="date" {...register("dueDate")} />
        </div>
        <button type="submit" className="btn btn-primary">Guardar cambios</button>
      </form>
    </div>
  );
}
export default EditReminder;