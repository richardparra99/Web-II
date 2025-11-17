import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/peliculas/HomePage.jsx';
import PeliculaDetailPage from './pages/peliculas/PeliculaDetailPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';
import MisReviewsPage from './reviews/MisReviewsPage.jsx';
import CreatePeliculaPage from './pages/peliculas/CreatePeliculaPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/peliculas/nueva" element={<CreatePeliculaPage />} />
        <Route path="/peliculas/:id" element={<PeliculaDetailPage />} />
        <Route path="/mis-reviews" element={<MisReviewsPage />} />
        <Route path="/hola" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
