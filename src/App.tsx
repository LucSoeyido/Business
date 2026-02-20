
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Dashboard from "./components/Dashboard";
import Session from './components/Session'
import Footer from './components/Footer'
import Rapport from './components/Rapport';

function App() {

  return (


    <BrowserRouter>

      <Routes>
        <Route path='/' element={<Dashboard />}>
        </Route>
        <Route path='/session' element={<Session />}>
        </Route>
        <Route path='/rapport' element={<Rapport />}></Route>

      </Routes>
      <Footer />

    </BrowserRouter>






  )
}

export default App
