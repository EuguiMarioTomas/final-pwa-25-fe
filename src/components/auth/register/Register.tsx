import {useState} from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import axios from 'axios';
import { Link } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function useRegister() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [ message, setMessage] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try{
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      await updateProfile(firebaseUser, {displayName: userName});

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users/createUser`, { userName, email, firebaseUid: firebaseUser.uid });
      setMessage('Usuario registrado correctamente.🟢');
    }catch(error: any){
      console.error(error);
      setMessage(`Error al registrar el usuario: ${error.message}🔴`);
    }finally{
      setLoading(false);
    }
  };
  return(
    <div className='container'>
      <h2>Registro</h2>
      <form onSubmit={handleRegister} className='d-flex flex-column gap-3'>
        <input className='form-control' type='text' placeholder='Nombre de usuario' value={userName} onChange={(e) => setUserName(e.target.value)} required />
        <input className='form-control' type='email' placeholder='Correo electrónico' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='form-control' type='password' placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className= 'btn btn-primary' type='submit' disabled={loading}>{loading ? 'Registrando...' : 'Registrar'}</button>
      </form>
      {message && <p>{message}</p>}
      <p>¿Ya tienes una cuenta? <Link to='/login'>Inicia sesión</Link></p>
    </div>
  );
}