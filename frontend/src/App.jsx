import { lazy, Suspense, useEffect, Component } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
const ProductDetailPage = lazy(() => import('./pages/shop/ProductDetailPage'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center p-6 text-center">
          <div>
            <h2 className="text-2xl font-rajdhani font-bold text-white mb-4">Something went wrong</h2>
            <p className="text-silver/60 mb-6">Failed to load this section. This usually happens after a new deployment.</p>
            <button onClick={() => window.location.reload()} className="bg-orange text-white px-6 py-2 rounded-lg font-bold">Refresh Page</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  const location = useLocation();

  useEffect(() => {
    // Warm up Render backend (Free Tier cold start fix)
    fetch(`${import.meta.env.VITE_API_URL || ''}/api/health`).catch(() => {});
    
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(location.state.scrollTo);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [location.state]);

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
  return (
    <ErrorBoundary>
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
        <Route path="/product/:id" element={
          <Suspense fallback={<FullPageLoader />}>
            <CustomCursor />
            <ProductDetailPage />
          </Suspense>
        } />
        <Route path="/admin/*" element={
          <Suspense fallback={<FullPageLoader />}>
            <CustomCursor />
            <AdminWrapper />
          </Suspense>
        } />
        <Route path="*" element={<MainSite />} />
      </Routes>
    </ErrorBoundary>
  );
}

function AdminWrapper() {
  const token = localStorage.getItem('sritech_token');
  return token ? <AdminDashboard /> : <AdminLogin />;
}
