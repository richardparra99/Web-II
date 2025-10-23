import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import FormLogin from './pages/auth/FormLogin.jsx'
import FormRegister from './pages/auth/FormRegister.jsx'
import ListaSorteos from './pages/sorteos/ListaSorteos.jsx'
import FormSorteo from './pages/sorteos/FormSorteos.jsx'
import ListaParticipantes from './pages/participantes/ListaParticipantes.jsx'
import FormParticipante from './pages/participantes/FormParticipantes.jsx'
import VerAmigoSecreto from './pages/participantes/VerAmigoSecreto.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ListaSorteos/>}></Route>
      <Route path="/sorteos/create" element={<FormSorteo/>}></Route>
      <Route path="/sorteos/:id/edit" element={<FormSorteo/>}></Route>
      <Route path="/sorteos/:idSorteo/participantes" element={<ListaParticipantes/>} />
      <Route path="/sorteos/:idSorteo/participantes/create" element={<FormParticipante />} />
      <Route path="/participantes/:hash" element={<VerAmigoSecreto />} />

      {/* <Route path="/personas/create" element={<FormPersona/>}></Route>
      <Route path="/personas/:id/edit" element={<FormPersona/>}></Route> */}
      <Route path="/login" element={<FormLogin/>}></Route>
      <Route path="/register" element={<FormRegister/>}></Route>
      <Route path="/hola" element={<App/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
