import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Register from './components/auth/register/Register';
import Login from './components/auth/login/Login';
import CreateReminder from "./pages/createReminder/createReminder";

import {useAuth} from "./context/auth/useAuth";

export default function App(){
  const {userLoggedIn} = useAuth();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={userLoggedIn ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createReminder" element={userLoggedIn ? <CreateReminder /> : <Navigate to="/login" />} />
        <Route path='*' element={<h1>Página no encontrada.🔴</h1>} />
        {/* Aquí puedes agregar más rutas según sea necesario */}
      </Routes>
    </Router>
  );
}