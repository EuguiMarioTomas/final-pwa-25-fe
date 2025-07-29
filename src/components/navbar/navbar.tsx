import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from '../../context/auth/useAuth';
import {logOut} from '../../firebase/auth';



import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  
  const auth = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () =>{
    await logOut();
    navigate('/login');
  };

  return(
    <div>   
      <nav className='navbar navbar-expand-lg navbar-dark bg-dark sticky-top px-3'>
        <Link className='navbar-brand' to='/'>
          PWA Final Project
        </Link>
        <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarNav'>
          <span className='navbar-toggler-icon'/>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav ms-auto'>
            {auth?.userLoggedIn ? (
              <>
                <li className='nav-item dropdown'>
                  <Link className='nav-link dropdown-toggle' to='#' role='button' data-bs-toggle='dropdown' aria-expanded='false'> 
                    Recordatorios
                  </Link>
                  <ul className='dropdown-menu'>
                    <li><Link className='dropdown-item' to='/createReminder'>Crear Recordatorio</Link></li>
                    <li><Link className='dropdown-item' to='/myReminders'>Mis Recordatorios</Link></li>
                    <li><Link className='dropdown-item' to='/sharedReminders'>Recordatorios Compartidos</Link></li>
                    <li><hr className="dropdown-divider"></hr></li>
                    <li><Link className='dropdown-item' to='/myArchivedReminders'>Recordatorios Archivados</Link></li>
                  </ul>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/home'>Inicio</Link> 
                </li>
                <li className='nav-item'>
                  <button className='btn btn-outline-light ms-2' onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </li>
              </>
              ):(
                <>
                <li className='nav-item'>
                  <Link className='nav-link' to='/login'>Iniciar Sesión</Link>
                </li>
                <li className='nav-item'>
                  <Link className='nav-link' to='/register'>Registrarse</Link>
                </li>
                </>
              )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;