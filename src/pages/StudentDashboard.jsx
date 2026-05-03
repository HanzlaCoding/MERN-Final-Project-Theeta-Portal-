import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BookOpen, Video, Settings, Search, LogOut, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const StudentDashboard = () => {
  const { user, loading, logout, login } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);

  if (loading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center text-lime-400 text-xs font-bold tracking-[0.3em] uppercase">
      Booting Workspace...
    </div>
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file); 
      
      const res = await api.put('/users/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Gently update auth context instead of a crude reload
      if (res.data.user) {
        login(res.data.user, localStorage.getItem('token'));
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      alert(err.response?.data?.message || "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const courses = user?.enrolledCourses?.length > 0 ? user.enrolledCourses : [];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50 font-sans selection:bg-lime-500/30 selection:text-lime-400">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 lg:w-72 flex-shrink-0 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex transition-all duration-300 relative z-20">
        <div>
          <div className="h-24 flex items-center justify-center lg:justify-start lg:px-10 border-b border-slate-800/50">
             <Lightbulb className="w-8 h-8 text-lime-400 flex-shrink-0" strokeWidth={2.5} />
             <span className="hidden lg:block ml-4 font-bold tracking-[0.2em] text-lg uppercase text-slate-50">Theeta</span>
          </div>

          <nav className="p-6 space-y-4">
            <Link to="/dashboard" className="flex items-center space-x-4 px-4 py-3 bg-slate-900/50 border border-slate-800 text-lime-400 rounded-2xl transition-all">
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block text-xs font-bold tracking-widest uppercase">My Courses</span>
            </Link>
            <Link to="/catalog" className="flex items-center space-x-4 px-4 py-3 text-slate-400 hover:text-slate-50 hover:bg-slate-900/30 rounded-2xl transition-all group">
              <Search className="w-5 h-5 flex-shrink-0 group-hover:text-lime-400 transition-colors" />
              <span className="hidden lg:block text-xs font-bold tracking-widest uppercase">Explore Catalog</span>
            </Link>
            <a href="#" className="flex items-center space-x-4 px-4 py-3 text-slate-400 hover:text-slate-50 hover:bg-slate-900/30 rounded-2xl transition-all group">
              <Settings className="w-5 h-5 flex-shrink-0 group-hover:text-lime-400 transition-colors" />
              <span className="hidden lg:block text-xs font-bold tracking-widest uppercase">Settings</span>
            </a>
          </nav>
        </div>

        <div className="p-6">
          <button onClick={logout} className="w-full flex items-center space-x-4 px-4 py-3 text-slate-500 hover:text-red-400 hover:bg-slate-900/30 rounded-2xl transition-all group">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:block text-xs font-bold tracking-widest uppercase">Disconnect</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="h-24 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 flex items-center justify-between px-8 lg:px-12 sticky top-0 z-10">
          <div className="relative w-full max-w-md hidden sm:block group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-lime-400 transition-colors" />
            <input 
              type="text" placeholder="Search portal..." 
              className="w-full bg-slate-900/30 border border-slate-800 rounded-full py-3 pl-12 pr-6 text-sm font-medium text-slate-100 placeholder-slate-600 focus:outline-none focus:border-lime-500/50 focus:bg-slate-900 transition-all duration-300"
            />
          </div>

          <div className="flex items-center space-x-5 ml-auto">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold tracking-wider text-slate-50">{user?.name || "LMS Student"}</p>
              <p className="text-[10px] text-lime-400 tracking-[0.2em] font-bold uppercase mt-1">{user?.role}</p>
            </div>
            {/* Clickable UI for seamless Avatar uploading */}
            <div className="relative group cursor-pointer w-12 h-12 rounded-full border-2 border-lime-500 p-0.5 shadow-[0_0_15px_rgba(132,204,22,0.2)]">
               <img 
                 src={user?.avatar?.url || 'https://ik.imagekit.io/default-avatar.png'} 
                 alt="Profile Avatar" 
                 className={`w-full h-full object-cover rounded-full transition-opacity ${isUploading ? 'opacity-30 animate-pulse' : 'group-hover:opacity-50'}`}
               />
               <input 
                 type="file" accept="image/*" title="Upload new avatar"
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                 onChange={handleAvatarChange} disabled={isUploading}
               />
            </div>
          </div>
        </header>

        <section className="flex-1 p-8 lg:p-12 overflow-y-auto relative">
          <div className="mb-12">
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-50 mb-3 drop-shadow-md">Active Enrollments</h2>
            <p className="text-[11px] font-bold text-slate-400 tracking-[0.2em] uppercase">Resume your training modules.</p>
          </div>
          
          {courses.length === 0 ? (
             <div className="text-slate-500 tracking-widest text-[10px] font-bold uppercase mt-8 border border-slate-800 border-dashed rounded-2xl p-10 text-center">
               You are not officially enrolled in any live modules.
             </div>
          ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {courses.map((course, idx) => (
                 <div key={course._id || idx} className="group bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden hover:border-lime-500/40 transition-all duration-500 flex flex-col">
                   <div className="h-52 bg-slate-900 relative overflow-hidden">
                     {course.thumbnail?.url ? (
                       <img src={course.thumbnail.url} alt={course.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                     ) : (
                       <div className="absolute inset-0 flex items-center justify-center"><BookOpen className="w-12 h-12 text-slate-800" /></div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent"></div>
                   </div>

                   <div className="p-8 flex-1 flex flex-col justify-between relative -mt-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800/50 rounded-t-2xl">
                     <div>
                       <h3 className="text-xl font-bold text-slate-50 mb-2 leading-tight group-hover:text-lime-400 transition-colors">{course.title}</h3>
                       <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mb-8">{course.instructor}</p>
                     </div>

                     <div className="space-y-3 mt-auto">
                       <div className="flex justify-between text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                         <span>Completion</span>
                         <span className="text-lime-400">{course.completion || 0}%</span>
                       </div>
                       <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                         <div className="bg-lime-500 h-full rounded-full shadow-[0_0_10px_rgba(132,204,22,0.8)] relative" style={{ width: `${course.completion || 0}%` }}>
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full blur-[2px] opacity-30"></div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentDashboard;
