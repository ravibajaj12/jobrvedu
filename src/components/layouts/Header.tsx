import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const location = useLocation();
  const { profile, signOut } = useAuth();
  const [sheetOpen, setSheetOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Results', path: '/results' },
    { name: 'Admit Cards', path: '/admit-cards' },
    { name: 'Answer Keys', path: '/answer-keys' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    setSheetOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold md:text-2xl">
          JobRVEdu.in
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActive(link.path) ? 'text-accent' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
          {profile?.role === 'admin' && (
            <Link to="/admin">
              <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Admin
              </Button>
            </Link>
          )}
          {profile ? (
            <Button variant="outline" size="sm" onClick={signOut} className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Logout
            </Button>
          ) : (
            <Link to="/admin/login">
              <Button variant="outline" size="sm" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Login
              </Button>
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <nav className="flex flex-col gap-4 pt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? 'text-primary' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {profile?.role === 'admin' && (
                <Link to="/admin" onClick={handleLinkClick}>
                  <Button variant="default" size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Admin
                  </Button>
                </Link>
              )}
              {profile ? (
                <Button variant="outline" size="sm" onClick={() => { signOut(); handleLinkClick(); }} className="w-full">
                  Logout
                </Button>
              ) : (
                <Link to="/admin/login" onClick={handleLinkClick}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
