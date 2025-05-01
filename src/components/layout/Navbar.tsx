
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { User, LogOut } from 'lucide-react';

interface NavbarProps {
  user?: { email: string } | null;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const isMobile = useIsMobile();

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Vote Social Pulse
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className={isMobile ? 'hidden' : 'block'}>
                {user.email}
              </span>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-white hover:text-primary-100">
                  Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                className="text-white hover:text-primary-100"
                onClick={onLogout}
              >
                {isMobile ? <LogOut size={20} /> : 'Logout'}
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:text-primary-100">
                  {isMobile ? <User size={20} /> : 'Login'}
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="secondary" className="text-primary-500 hover:text-primary-700">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
