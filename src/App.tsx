import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/navbar/navbar";
import Register from './components/auth/register/Register';
import Login from './components/auth/login/Login';
import HomePage from "./pages/home";
import CreateReminder from "./pages/createReminders/createReminder";
import MyReminders from "./pages/getReminders/myReminders";
import MyArchivedReminders from "./pages/getReminders/getArchivedReminders";
import SharedReminders from "./pages/getReminders/getSharedReminders";
import EditReminder from "./pages/updateReminders/updateReminders";

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
        <Route path="/home" element={<HomePage />} />
        <Route path="/createReminder" element={userLoggedIn ? <CreateReminder /> : <Navigate to="/login" />} />
        <Route path="/myReminders" element={userLoggedIn ? <MyReminders /> : <Navigate to="/login" />} />
        <Route path="/myArchivedReminders" element={userLoggedIn ? <MyArchivedReminders /> : <Navigate to="/login" />} />
        <Route path="/sharedReminders" element={userLoggedIn ? <SharedReminders /> : <Navigate to="/login" />} />
        <Route path="/editReminder/:id" element={userLoggedIn ? <EditReminder /> : <Navigate to='/login' />} />
        <Route path='*' element={<h1>Página no encontrada.🔴</h1>} />
        
      </Routes>
    </Router>
  );
}