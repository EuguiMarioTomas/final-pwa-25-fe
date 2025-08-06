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
      navigate('/myReminders');
    }catch(error){
      console.error('Error al crear el recordatorio:', error);
      alert('Error al crear el recordatorio. Inténtalo de nuevo.');
    }
  };

  return(
    <div className='container create-reminder-container mt-5'>
      <h1 className='create-title mb-4'>Crear Recordatorio</h1>
      <form onSubmit={handleSubmit(onSubmit)} className='reminder-form'>
        <div className='row'>
          <div className='mb-3 col-8'>
            <input className='form-control' placeholder='🏷️Título... ej.Supermercado' {...register('title', {required:true})}/>
            {errors.title && <span className='text-danger'>El título es obligatorio.</span>}
          </div>
          <div className='mb-3 col-4'>
            <select className='form-select' {...register('type', {required:true})}>
              <option value='Pendiente'>Pendiente</option>
              <option value='Evento'>Evento</option>
              <option value='Idea'>Idea</option>
              <option value='Otro'>Otro</option>
            </select>
            {errors.type && <span className='text-danger'>El tipo es obligatorio.</span>}
          </div>
          <div className='mb-3 col-8'>
            <textarea className='form-control' placeholder='✍🏽 Descripción... ej.Comprar mayonesa' rows={3} {...register('description', {required:true})}/>
            {errors.description && <span className='text-danger'>La descripción es obligatoria.</span>}
          </div>
          <div className='mb-3 col-4'>
            <input className='form-control py-3 mt-2' type='date' {...register('dueDate')}/>
          </div>
        </div>
        <div className='mt-auto d-flex justify-content-end mt-3'>
          <button className='btn btn-custom' type='submit'>Crear Recordatorio</button>
        </div>
      </form>
    </div>
  );
}

export default CreateReminder;