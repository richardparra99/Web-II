import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './styles.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ListaPersona from './pages/personas/ListaPersona.jsx'
import FormPersona from './pages/personas/FormPersona.jsx'
import FormLogin from './pages/auth/FormLogin.jsx'
import FormRegister from './pages/auth/FormRegister.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ListaPersona/>}></Route>
      <Route path="/personas/create" element={<FormPersona/>}></Route>
      <Route path="/personas/:id/edit" element={<FormPersona/>}></Route>
      <Route path="/login" element={<FormLogin/>}></Route>
      <Route path="/register" element={<FormRegister/>}></Route>
      <Route path="/hola" element={<App/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
