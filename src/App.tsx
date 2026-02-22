
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
        <Route path='/' element={<Dashboard />}>
        </Route>
        <Route path='/session' element={<Session />}>
        </Route>
        <Route path='/rapport' element={<Rapport />}></Route>
        <Route path='/depenses' element={<Depenses />}></Route>
        <Route path='/list_rapport' element={<ListRapport />}></Route>


      </Routes>
     

    </BrowserRouter>






  )
}

export default App
