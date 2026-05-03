import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';

const AdminDashboard = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    instructor: '',
    price: 0,
  });
  const [file, setFile] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setCourseData({ ...courseData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg(null);

    try {
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('instructor', courseData.instructor);
      formData.append('price', courseData.price);
      if (file) formData.append('thumbnail', file);

      await api.post('/courses', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setStatusMsg({ type: 'success', text: 'TRANSMISSION COMPLETE: COURSE SAVED.' });
      setCourseData({ title: '', description: '', instructor: '', price: 0 });
      setFile(null);
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'ERROR: CREATION FAILED' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-50 selection:bg-lime-500/30 selection:text-lime-400 pt-32 pb-12">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 relative z-10">
        
        <div className="mb-8">
           <h1 className="text-3xl font-bold tracking-[0.1em] text-slate-50 uppercase drop-shadow-md">Admin Workspace</h1>
           <p className="text-[10px] font-bold text-lime-400 tracking-[0.3em] uppercase mt-1">Course Deployment Terminal</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 sm:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime-500/10 via-lime-400 to-lime-500/10"></div>

          {statusMsg && (
            <div className={`p-4 mb-8 rounded-lg text-xs font-bold tracking-widest uppercase text-center border ${statusMsg.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-lime-500/10 border-lime-500/30 text-lime-400'}`}>
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Course Title" id="title" value={courseData.title} onChange={handleChange} required />
            
            <div className="flex flex-col group w-full mb-6 relative">
              <label htmlFor="description" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
                Course Description <span className="text-lime-500 ml-1">*</span>
              </label>
              <textarea 
                id="description" name="description" value={courseData.description} onChange={handleChange} required
                className="w-full bg-transparent border-b border-slate-700/80 px-1 py-2 text-slate-50 placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors duration-300 resize-none"
                rows="3" placeholder="Syllabus breakdown..."
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <InputField label="Instructor" id="instructor" value={courseData.instructor} onChange={handleChange} placeholder="Lecturer name" required />
               <InputField label="License Tag ($)" id="price" type="number" value={courseData.price} onChange={handleChange} placeholder="0.00" required />
            </div>

            <div className="flex flex-col w-full mb-8">
              <label htmlFor="thumbnail" className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-4">
                Manifest Asset (Image)
              </label>
              <input 
                type="file" id="thumbnail" accept="image/*" onChange={handleFileChange}
                className="block w-full text-xs text-slate-500 file:mr-6 file:py-2 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:tracking-widest file:uppercase file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 hover:file:text-white transition-all cursor-pointer"
              />
            </div>

            <div className="pt-4">
               <Button type="submit" isLoading={isLoading} className="w-full">Deploy Course</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
