import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import SEO from './components/SEO';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';

// Lazy load below-fold main sections
const Products = lazy(() => import('./components/Products'));
const Projects = lazy(() => import('./components/Projects'));
const Industries = lazy(() => import('./components/Industries'));
const HowWeWork = lazy(() => import('./components/HowWeWork'));
const Skills = lazy(() => import('./components/Skills'));
const Clients = lazy(() => import('./components/Clients'));
const OurCompanies = lazy(() => import('./components/OurCompanies'));
const Founder = lazy(() => import('./components/Founder'));
const Testimonials = lazy(() => import('./components/Testimonials'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));

// Admin & Auth pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AuthPage = lazy(() => import('./pages/auth/AuthPage'));
const ShopPage = lazy(() => import('./pages/shop/ShopPage'));

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-24" aria-hidden="true">
      <div
        className="w-10 h-10 rounded-full border-2 border-orange border-t-transparent animate-spin"
        role="status"
        aria-label="Loading section"
      />
    </div>
  );
}

function FullPageLoader() {
  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 48, height: 48, border: '3px solid rgba(255,107,43,0.3)', borderTop: '3px solid #ff6b2b', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <p style={{ color: '#c0c8d8', fontFamily: 'Rajdhani, sans-serif', fontSize: 14, letterSpacing: 2 }}>LOADING...</p>
      </div>
    </div>
  );
}

function MainSite() {
  return (
    <>
      <SEO />
      <CustomCursor />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Suspense fallback={<SectionLoader />}>
          <Products />
          <Projects />
          <Industries />
          <HowWeWork />
          <Skills />
          <Clients />
          <OurCompanies />
          <Founder />
          <Testimonials />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
}

export default function App() {
  const isAdmin = !!localStorage.getItem('sritech_token');
  return (
    <Routes>
      <Route path="/" element={<MainSite />} />
      <Route path="/auth" element={
        <Suspense fallback={<FullPageLoader />}>
          <CustomCursor />
          <Navbar />
          <AuthPage />
        </Suspense>
      } />
      <Route path="/shop" element={
        <Suspense fallback={<FullPageLoader />}>
          <CustomCursor />
          <ShopPage />
        </Suspense>
      } />
      <Route path="/admin" element={<Suspense fallback={<FullPageLoader />}>{isAdmin ? <AdminDashboard /> : <AdminLogin />}</Suspense>} />
      <Route path="*" element={<MainSite />} />
    </Routes>
  );
}
