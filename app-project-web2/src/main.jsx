import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FormLogin from './auth/FormLogin.jsx';
import FormRegister from './auth/FormRegister.jsx';
import EventsList from './events/EventsList.jsx';
import EventDetails from './events/EventDetails.jsx';
import CreateEvent from './events/CreateEvent.jsx';
import MyRegistrations from "./registrations/MyRegistrations.jsx";
import "leaflet/dist/leaflet.css";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} />
        <Route path="/registrations/my" element={<MyRegistrations />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
