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
import EditEvent from './events/EditEvent.jsx';
import EventPayments from './payments/EventPayments.jsx';
import UsersList from './admin/UsersList.jsx';
import EventsStats from './admin/EventsStats.jsx';
import ValidatorPage from './validator/ValidatorPage.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} />
        <Route path="/registrations/my" element={<MyRegistrations />}></Route>
        <Route path="/organizer/events/:id/payments" element={<EventPayments />} />
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/stats" element={<EventsStats />} />
        <Route path="/validator" element={<ValidatorPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
