
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from "./components/Dashboard";
import Session from './components/Session'
import Footer from './components/Footer'
import Rapport from './components/Rapport'
import Depenses from './components/Depenses'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListRapport from './components/ListRapport';
import ListSession from './components/ListSession';
import ListDepenses from './components/ListeDepenses';
import axios from 'axios';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
// On vérifie s'il y a un token dans le navigateur au démarrage de l'application
const token = localStorage.getItem('auth_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}


function App() {

  return (


    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />


      <Routes>
        {/* 🟢 ROUTE PUBLIQUE (Accessible sans connexion) */}
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Dashboard />}>
          </Route>

          <Route path='/rapport' element={<Rapport />}></Route>
          <Route path='/depenses' element={<Depenses />}></Route>
          <Route path='/list_rapport' element={<ListRapport />}></Route>

          <Route path='/list_depense' element={<ListDepenses />}></Route>
        </Route>
        {/* 🔴 ROUTES ULTRA-PROTÉGÉES (Accessibles UNIQUEMENT aux administrateurs) */}
        <Route element={<ProtectedRoute allowedRoles={['administrateur']} />}>
          <Route path='/list_session' element={<ListSession />}></Route>
          <Route path='/session' element={<Session />}>
          </Route>
          <Route path="/utilisateurs" element={<div className="p-5 text-center">Page Utilisateurs (Admin Only)</div>} />
          <Route path="/partenaires" element={<div className="p-5 text-center">Page Partenaires (Admin Only)</div>} />
        </Route>



      </Routes>


    </BrowserRouter>






  )
}

export default App
