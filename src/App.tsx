import React, { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HubPage } from './pages/HubPage';
import { MenuPage } from './pages/MenuPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { CartDrawer } from './components/CartDrawer';
import { MozoIADrawer } from './components/MozoIADrawer';

type AppRoute = 'hub' | 'carta' | 'delivery';

function AppContent() {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('hub');

  // Handle URL hash / path routing synchronization
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'carta' || hash === 'menu') {
        setCurrentRoute('carta');
      } else if (hash === 'delivery' || hash === 'checkout') {
        setCurrentRoute('delivery');
      } else {
        setCurrentRoute('hub');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
    setCurrentRoute(route);
    if (route === 'hub') {
      window.location.hash = '';
    } else {
      window.location.hash = `#/${route}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#EFE6D8] text-[#284233] flex flex-col selection:bg-[#BA7738] selection:text-white">
      {/* Sticky Top Navigation */}
      <Navbar currentRoute={currentRoute} onNavigate={navigateTo} />

      {/* Main Routed Page View */}
      <div className="flex-1">
        {currentRoute === 'hub' && <HubPage onNavigate={navigateTo} />}
        {currentRoute === 'carta' && <MenuPage onNavigate={navigateTo} />}
        {currentRoute === 'delivery' && <DeliveryPage onNavigate={navigateTo} />}
      </div>

      {/* Global Slide-Over Drawers */}
      <CartDrawer />
      <MozoIADrawer />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
