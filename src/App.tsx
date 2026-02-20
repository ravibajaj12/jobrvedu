import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import IntersectObserver from '@/components/common/IntersectObserver';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layouts/Header';
import Footer from '@/components/layouts/Footer';

import routes from './routes';

import { AuthProvider } from '@/contexts/AuthContext';
import { RouteGuard } from '@/components/common/RouteGuard';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <RouteGuard>
          <IntersectObserver />
          <div className="flex min-h-screen flex-col">
            <Routes>
              {routes.map((route, index) => {
                // Admin routes don't need header/footer
                if (route.path.startsWith('/admin')) {
                  return (
                    <Route
                      key={index}
                      path={route.path}
                      element={route.element}
                    />
                  );
                }
                // Public routes with header/footer
                return (
                  <Route
                    key={index}
                    path={route.path}
                    element={
                      <>
                        <Header />
                        <main className="flex-grow">{route.element}</main>
                        <Footer />
                      </>
                    }
                  />
                );
              })}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster />
        </RouteGuard>
      </AuthProvider>
    </Router>
  );
};

export default App;
