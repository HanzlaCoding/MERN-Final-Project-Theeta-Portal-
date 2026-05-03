import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Lightbulb } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Data submit hny ky baad reset ho, Page refresh na ho
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password });
      login(response.data.user);
      if (response.data.user.role === 'admin') navigate('/admin');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-10 sm:p-12 rounded-2xl shadow-2xl">
        
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="flex items-center space-x-3 mb-2">
            <Lightbulb className="w-8 h-8 text-lime-400" strokeWidth={2.5} />
            <h1 className="text-2xl font-bold tracking-[0.2em] text-slate-50 uppercase">
              Theeta Trainings
            </h1>
          </div>
          <p className="text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-2">
            Create Account
          </p>
        </div>
        
        <form className="space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <InputField
              id="name"
              type="text"
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // Save & Change (Simultaneously)
              placeholder="e.g. Jane Doe"
              required
            />
            <InputField
              id="email"
              type="email"
              label="Student Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hello@theeta.com"
              required
            />
            <InputField
              id="password"
              type="password"
              label="Secure Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-6">
            <Button type="submit" isLoading={isLoading} className="w-full">
              Register Securely
            </Button>
          </div>
          
          <p className="text-center text-[10px] tracking-widest text-slate-400 mt-6 uppercase">
            Already a member? <Link to="/login" className="text-lime-400 hover:text-lime-300 transition-colors ml-1">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
