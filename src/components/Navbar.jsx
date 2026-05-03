import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Button from './Button';
import { Lightbulb } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          
          <div className="flex-shrink-0 flex items-center space-x-3">
            <Lightbulb className="w-8 h-8 text-lime-400" strokeWidth={2.5} />
            <Link to="/" className="text-xl font-bold tracking-[0.2em] uppercase text-slate-50">
              Theeta
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-[10px] font-bold tracking-widest text-slate-400 hover:text-lime-400 transition-colors uppercase">
                    Admin Panel
                  </Link>
                )}
                {user?.role === 'student' && (
                  <Link to="/dashboard" className="text-[10px] font-bold tracking-widest text-slate-400 hover:text-lime-400 transition-colors uppercase">
                    My Courses
                  </Link>
                )}
                <Button variant="secondary" onClick={handleLogout}>
                  Disconnect
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button variant="primary">Access Portal</Button>
              </Link>
            )}
          </div>
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
