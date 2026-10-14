import { Route, Routes } from 'react-router-dom';
import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Auth from './pages/Auth';
import DashboardRoute from './pages/Dashboard';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/servico/:id" element={<ServiceDetail />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardRoute page="ads" />} />
        <Route path="/dashboard/perfil" element={<DashboardRoute page="profile" />} />
        <Route path="/dashboard/favoritos" element={<DashboardRoute page="favorites" />} />
        <Route path="/dashboard/mensagens" element={<DashboardRoute page="messages" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
