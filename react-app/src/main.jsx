import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ListaDocente from './ListaDocente.jsx'
import FormPrueba from './FormPrueba.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ListaDocente/>}></Route>
      <Route path="/personas/create" element={<FormPrueba/>}></Route>
      <Route path="/hola" element={<App/>}></Route>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
