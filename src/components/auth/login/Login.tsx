import {useState} from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage('Inicio de sesión exitoso.🟢');
      navigate('/home');
    } catch (error) {
      if(error instanceof FirebaseError){
        console.error(error);
        if(error.code === 'auth/user-not-found') {
          setMessage('Usuario no encontrado.🔴');
        }else if(error.code === 'auth/wrong-password') {
          setMessage('Contraseña incorrecta.🔴');
        }else{
          setMessage(`Error al iniciar sesión: ${error.message}🔴`);
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return(
    <div className='container mt-5 login-container'>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className='d-flex flex-column gap-3 login-form'>
        <input className='form-control' type='email' placeholder='Correo electrónico' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='form-control' type='password' placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className='btn btn-custom' type='submit' disabled={loading}>{loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}