import {useForm} from 'react-hook-form';
import axios from 'axios';
import {useAuth} from '../../context/auth/useAuth';
import {useNavigate} from 'react-router-dom';

interface ReminderFormData{
  title: string;
  description: string;
  type: 'Pendiente' |'Evento' | 'Idea' | 'Otro';
  dueDate?: Date;
}

function CreateReminder() {
  const {register, handleSubmit, reset, formState:{errors}} = useForm<ReminderFormData>();
  const {currentUser} = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: ReminderFormData) => {
    if(!currentUser){
      alert('Debes iniciar sesión para crear un recordatorio.');
      return;
    }
    try{
      const userResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/getUserByFirebaseUid/${currentUser.uid}`);
      const mongoUserId = userResponse.data.data._id;
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/reminders/createReminder`, {
        ...data, authorId: mongoUserId,
      });
      console.log('Recordatorio creado:', response.data);
      reset();
      navigate('/reminders');
    }catch(error){
      console.error('Error al crear el recordatorio:', error);
      alert('Error al crear el recordatorio. Inténtalo de nuevo.');
    }
  };

  return(
    <div className='container'>
      <h1>Crear Recordatorio</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-3'>
          <label className='form-label'>Título</label>
          <input className='form-control' {...register('title', {required:true})}/>
          {errors.title && <span className='text-danger'>El título es obligatorio.</span>}
        </div>
        <div className='mb-3'>
          <label className='form-label'>Descripción</label>
          <textarea className='form-control' rows={3} {...register('description', {required:true})}/>
          {errors.description && <span className='text-danger'>La descripción es obligatoria.</span>}
        </div>
        <div className='mb-3'>
          <label className='form-label'>Tipo</label>
          <select className='form-select' {...register('type', {required:true})}>
            <option value='Pendiente'>Pendiente</option>
            <option value='Evento'>Evento</option>
            <option value='Idea'>Idea</option>
            <option value='Otro'>Otro</option>
          </select>
          {errors.type && <span className='text-danger'>El tipo es obligatorio.</span>}
        </div>
        <div className='mb-3'>
          <label className='form-label'>Fecha de vencimiento</label>
          <input className='form-control' type='date' {...register('dueDate')}/>
        </div>

        <button className='btn btn-primary' type='submit'>Crear Recordatorio</button>
      </form>
    </div>
  );
}

export default CreateReminder;