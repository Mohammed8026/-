
import React, { useState, useEffect } from 'react';
import { ExternalLink, Layers, RefreshCw, Palette, LayoutGrid, Filter, X, Calendar, Tag, CheckCircle2, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Project } from '../types';
import { db } from '../dbService';

const Portfolio: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [colorFilter, setColorFilter] = useState('الكل');
  const [tagFilter, setTagFilter] = useState('الكل');
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const loadProjects = async () => {
    setIsLoading(true);
    const data = await db.getProjects();
    setProjects(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProjects();
    window.addEventListener('projectsUpdated', loadProjects);
    return () => window.removeEventListener('projectsUpdated', loadProjects);
  }, []);

  const categories = ['الكل', 'متاجر', 'شركات', 'شخصي'];
  const colors = [
    { name: 'الكل', class: 'bg-slate-700' },
    { name: 'أزرق', class: 'bg-blue-600' },
    { name: 'ذهبي', class: 'bg-amber-500' },
    { name: 'أرجواني', class: 'bg-purple-600' },
    { name: 'أخضر', class: 'bg-emerald-600' }
  ];

  // Extract unique tags from all projects
  const allTags = ['الكل', ...Array.from(new Set(projects.flatMap(p => p.tags || [])))];

  const filteredProjects = projects.filter(p => {
    const matchesCategory = categoryFilter === 'الكل' || p.category === categoryFilter;
    const matchesColor = colorFilter === 'الكل' || p.colorPalette === colorFilter;
    const matchesTag = tagFilter === 'الكل' || (p.tags && p.tags.includes(tagFilter));
    return matchesCategory && matchesColor && matchesTag;
  });

  const getColorClass = (palette?: string) => {
    switch(palette) {
      case 'أزرق': return 'border-blue-500/50 hover:border-blue-500';
      case 'ذهبي': return 'border-amber-500/50 hover:border-amber-500';
      case 'أرجواني': return 'border-purple-500/50 hover:border-purple-500';
      case 'أخضر': return 'border-emerald-500/50 hover:border-emerald-500';
      default: return 'border-slate-800 hover:border-amber-500/50';
    }
  };

  const getThemeColor = (palette?: string) => {
    switch(palette) {
      case 'أزرق': return 'text-blue-500 bg-blue-500/10';
      case 'ذهبي': return 'text-amber-500 bg-amber-500/10';
      case 'أرجواني': return 'text-purple-500 bg-purple-500/10';
      case 'أخضر': return 'text-emerald-500 bg-emerald-500/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const resetFilters = () => {
    setCategoryFilter('الكل');
    setColorFilter('الكل');
    setTagFilter('الكل');
  };

  return (
    <div className="container mx-auto px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-6xl font-black mb-4">معرض الأعمال المتقدم</h2>
        <p className="text-slate-400 max-w-2xl mx-auto font-medium">استخدم الفلاتر المتقدمة للوصول إلى التصميم الذي يتناسب مع رؤيتك.</p>
      </motion.div>

      {/* Advanced Filter Bar */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-slate-900/50 p-8 rounded-[3rem] border border-slate-800 mb-12 shadow-2xl backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Category Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <LayoutGrid size={14} /> فئة المشروع
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                    categoryFilter === cat 
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <Palette size={14} /> لوحة الألوان
            </div>
            <div className="flex items-center flex-wrap gap-3">
              {colors.map(color => (
                <motion.button
                  key={color.name}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.8 }}
                  onClick={() => setColorFilter(color.name)}
                  title={color.name}
                  className={`w-10 h-10 rounded-full border-2 transition-all transform ${color.class} ${
                    colorFilter === color.name ? 'border-white ring-4 ring-white/10 scale-110 shadow-xl' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
              <Hash size={14} /> الوسوم التقنية
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto scrollbar-hide pr-2">
              {allTags.map(tag => (
                <motion.button
                  key={tag}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTagFilter(tag)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                    tagFilter === tag 
                      ? 'bg-amber-600 border-amber-500 text-white' 
                      : 'bg-slate-950/50 border-slate-800 text-slate-500 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        {(categoryFilter !== 'الكل' || colorFilter !== 'الكل' || tagFilter !== 'الكل') && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={resetFilters}
            className="mt-8 mx-auto flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <RefreshCw size={14} /> إعادة تعيين جميع الفلاتر
          </motion.button>
        )}
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center py-20 gap-4 text-slate-500">
          <RefreshCw className="animate-spin" size={32} />
          <p className="font-bold">جاري تحميل المعرض...</p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 bg-slate-800/20 rounded-[3rem] border border-dashed border-slate-700"
        >
           <Filter size={48} className="mx-auto mb-4 text-slate-600" />
           <p className="text-xl font-bold text-slate-500">لا توجد نتائج تطابق هذه الفلاتر حالياً.</p>
           <button onClick={resetFilters} className="mt-4 text-amber-500 hover:underline font-bold">إعادة تعيين الكل</button>
        </motion.div>
      ) : (
        <motion.div 
          layout
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map(project => (
              <motion.div 
                key={project.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className={`group relative bg-slate-800/30 rounded-[2.5rem] overflow-hidden border cursor-pointer transition-all hover:shadow-2xl hover:shadow-slate-900/50 ${getColorClass(project.colorPalette)}`}
              >
                <div className="aspect-video overflow-hidden relative">
                  <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-black border border-white/10 uppercase tracking-wider">{project.category}</span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black group-hover:text-amber-500 transition-colors">{project.title}</h3>
                    {project.colorPalette && (
                      <div className="flex items-center gap-1.5 bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-800">
                         <div className={`w-2.5 h-2.5 rounded-full ${
                           project.colorPalette === 'ذهبي' ? 'bg-amber-500' : 
                           project.colorPalette === 'أزرق' ? 'bg-blue-600' : 
                           project.colorPalette === 'أرجواني' ? 'bg-purple-600' : 'bg-emerald-600'
                         }`} />
                         <span className="text-[10px] font-bold text-slate-400">{project.colorPalette}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Tags Preview */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.slice(0, 3).map(t => (
                      <span key={t} className="text-[9px] font-black text-slate-500 bg-slate-950/50 px-2 py-0.5 rounded border border-slate-800 uppercase">#{t}</span>
                    ))}
                    {(project.tags?.length || 0) > 3 && <span className="text-[9px] font-black text-slate-600">+{project.tags!.length - 3}</span>}
                  </div>

                  <p className="text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2 font-medium">{project.description}</p>
                  
                  <button className="w-full flex items-center justify-center gap-3 bg-slate-800 group-hover:bg-amber-600 py-4 rounded-2xl text-white font-bold transition-all border border-slate-700 group-hover:border-amber-400 shadow-lg">
                    <Layers size={18} />
                    <span>عرض تفاصيل المشروع</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setSelectedProject(null)}></div>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-slate-900 border border-slate-800 w-full max-w-6xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-3xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-slate-950/50 text-white rounded-full hover:bg-red-500 transition-colors md:hidden"
              >
                <X size={24} />
              </button>

              <div className="md:w-3/5 relative bg-slate-950 overflow-hidden">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col">
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="hidden md:flex absolute top-8 left-8 p-3 text-slate-500 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                >
                  <X size={32} />
                </button>

                <div className="mt-4 md:mt-10">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-500/20">
                      {selectedProject.category}
                    </span>
                    {selectedProject.colorPalette && (
                      <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border border-current ${getThemeColor(selectedProject.colorPalette)}`}>
                        {selectedProject.colorPalette}
                      </span>
                    )}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black mb-6 leading-tight">
                    {selectedProject.title}
                  </h3>

                  <div className="space-y-6 mb-10">
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                      {selectedProject.description}
                    </p>
                    
                    {selectedProject.tags && (
                      <div className="flex flex-wrap gap-2 py-4 border-y border-slate-800">
                        {selectedProject.tags.map(t => (
                          <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-700">
                             <Hash size={12} className="text-amber-500" /> {t}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">
                          <Calendar size={14} /> سنة التنفيذ
                        </div>
                        <div className="text-white font-bold">2024 - 2025</div>
                      </div>
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-1 uppercase tracking-wider">
                          <Tag size={14} /> حالة المشروع
                        </div>
                        <div className="text-green-500 font-bold flex items-center gap-1">
                          <CheckCircle2 size={14} /> مكتمل
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto space-y-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-amber-600/30 flex items-center justify-center gap-3"
                    >
                      <ExternalLink size={24} />
                      زيارة الموقع المباشر
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
