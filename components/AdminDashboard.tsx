
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Plus, Trash2, Package, MessageSquare, Settings, LogOut, X, Save, RefreshCw, Database, Loader2, Eye, CheckCircle, Send, ExternalLink, ShieldCheck, Palette, Hash } from 'lucide-react';
import { Project, SiteOrder } from '../types';
import { db } from '../dbService';

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'orders' | 'settings'>('orders');
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<SiteOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    title: '', category: 'شركات', image: '', description: '', colorPalette: 'أزرق', tags: []
  });
  const [tagInput, setTagInput] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    const p = await db.getProjects();
    const o = await db.getOrders();
    setProjects(p);
    setOrders(o);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('projectsUpdated', loadData);
    window.addEventListener('ordersUpdated', loadData);
    return () => {
      window.removeEventListener('projectsUpdated', loadData);
      window.removeEventListener('ordersUpdated', loadData);
    };
  }, []);

  const handleApproveOrder = async (id: string) => {
    await db.updateOrderStatus(id, 'مكتمل');
    alert('تمت الموافقة على التصميم وإرساله للعميل بنجاح!');
  };

  const openPreview = (html?: string) => {
    if (!html) {
      alert('لا يوجد كود مولد لهذا الطلب بعد.');
      return;
    }
    setPreviewHtml(html);
  };

  const handleSaveProject = async () => {
    if (!newProject.title || !newProject.image) return;
    
    // Convert tags string input to array if needed, though we manage as state
    await db.addProject(newProject as Project);
    setIsAddingProject(false);
    setNewProject({ title: '', category: 'شركات', image: '', description: '', colorPalette: 'أزرق', tags: [] });
    setTagInput('');
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (newProject.tags?.includes(tagInput.trim())) return;
    setNewProject({ ...newProject, tags: [...(newProject.tags || []), tagInput.trim()] });
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setNewProject({ ...newProject, tags: newProject.tags?.filter(t => t !== tag) });
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-950 flex font-['Tajawal'] text-slate-100">
      {/* Sidebar */}
      <div className="w-72 bg-slate-900 border-l border-slate-800 flex flex-col p-8 shadow-2xl">
        <div className="text-2xl font-black text-amber-500 mb-12 flex items-center gap-3 italic">
          <ShieldCheck size={32} />
          <span>Al-Othmany Panel</span>
        </div>

        <nav className="flex-1 space-y-3">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'orders' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
            <div className="flex items-center gap-3"><MessageSquare size={18} /> طلبات العملاء</div>
            {orders.filter(o => o.status !== 'مكتمل').length > 0 && <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-[10px]">{orders.filter(o => o.status !== 'مكتمل').length}</span>}
          </button>
          
          <button onClick={() => setActiveTab('projects')} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'projects' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Package size={18} /> معرض الأعمال
          </button>
          
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 p-4 rounded-2xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-800'}`}>
            <Settings size={18} /> الإعدادات
          </button>
        </nav>

        <button onClick={onLogout} className="flex items-center gap-3 p-5 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-all mt-auto border border-red-400/20">
          <LogOut size={18} /> تسجيل الخروج
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-12">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-white">
              {activeTab === 'projects' && 'إدارة المعرض'}
              {activeTab === 'orders' && 'مركز طلبات التصميم'}
              {activeTab === 'settings' && 'إعدادات النظام'}
            </h2>
            <p className="text-slate-500 mt-2 font-medium">مرحباً محمد، لديك {orders.length} طلبات إجمالية في النظام.</p>
          </div>
          
          <div className="flex gap-4">
             <button onClick={loadData} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-amber-500 transition-colors">
                <RefreshCw size={24} className={isLoading ? 'animate-spin' : ''} />
             </button>
             {activeTab === 'projects' && (
                <button onClick={() => setIsAddingProject(true)} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-4 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-amber-600/20">
                   <Plus size={24} /> إضافة مشروع جديد
                </button>
             )}
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
             <Loader2 size={48} className="animate-spin text-amber-500" />
             <p className="text-slate-400 font-bold">جاري تحديث قاعدة البيانات...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'orders' && orders.map(order => (
              <div key={order.id} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2rem] flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-amber-500/30 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold">{order.customerName}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      order.status === 'مكتمل' ? 'bg-green-500/10 text-green-500' : 
                      order.status === 'تم التوليد' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>{order.status}</span>
                  </div>
                  <div className="bg-slate-950/80 p-5 rounded-2xl text-sm text-slate-400 border border-slate-800 mb-4 line-clamp-2">
                    <span className="text-amber-500 font-bold ml-2">متطلبات الزبون:</span> {order.requirements}
                  </div>
                  <div className="flex gap-6 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span>📅 {order.date}</span>
                    <span>💰 الميزانية: {order.price}</span>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => openPreview(order.htmlContent)}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-4 rounded-2xl font-bold transition-all border border-slate-700"
                  >
                    <Eye size={18} /> معاينة الموقع
                  </button>
                  
                  {order.status === 'تم التوليد' && (
                    <button 
                      onClick={() => handleApproveOrder(order.id)}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 px-6 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-600/20"
                    >
                      <CheckCircle size={18} /> موافقة وإرسال
                    </button>
                  )}
                  
                  <button onClick={() => db.deleteOrder(order.id)} className="p-4 text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}

            {activeTab === 'projects' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {projects.map(p => (
                   <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all relative group">
                      <div className="aspect-video relative overflow-hidden">
                        <img src={p.image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button onClick={() => db.deleteProject(p.id)} className="p-4 bg-red-600 rounded-2xl text-white shadow-xl hover:scale-110 transition-transform">
                            <Trash2 size={24} />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-amber-500 text-[10px] font-bold uppercase">{p.category}</div>
                          <div className="flex gap-1">
                             {p.tags?.slice(0, 2).map(t => (
                               <span key={t} className="text-[8px] font-black bg-slate-800 px-1 rounded">#{t}</span>
                             ))}
                          </div>
                          {p.colorPalette && <div className={`w-3 h-3 rounded-full border border-white/20 ${p.colorPalette === 'ذهبي' ? 'bg-amber-500' : p.colorPalette === 'أزرق' ? 'bg-blue-600' : p.colorPalette === 'أرجواني' ? 'bg-purple-600' : 'bg-emerald-600'}`} />}
                        </div>
                        <h4 className="font-bold text-xl">{p.title}</h4>
                      </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewHtml && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-600 p-2 rounded-xl text-white"><Eye size={24} /></div>
              <h3 className="text-2xl font-bold">معاينة الموقع المولد بواسطة AI</h3>
            </div>
            <button onClick={() => setPreviewHtml(null)} className="p-4 hover:bg-slate-800 rounded-full transition-all text-slate-400 hover:text-white">
              <X size={32} />
            </button>
          </div>
          <div className="flex-1 bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-800">
             <iframe 
               title="Website Preview" 
               className="w-full h-full" 
               srcDoc={previewHtml} 
             />
          </div>
          <div className="mt-8 flex justify-center gap-6">
             <button className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-5 rounded-2xl font-bold text-xl flex items-center gap-3 shadow-2xl shadow-amber-600/30 transition-all">
                <Send size={24} /> إرسال الملفات النهائية للعميل
             </button>
             <button onClick={() => setPreviewHtml(null)} className="bg-slate-800 hover:bg-slate-700 text-white px-12 py-5 rounded-2xl font-bold text-xl transition-all">
                إغلاق المعاينة
             </button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-[3rem] p-10 shadow-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-bold">مشروع جديد</h3>
              <button onClick={() => setIsAddingProject(false)}><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">اسم المشروع</label>
                  <input placeholder="أدخل الاسم" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none focus:border-amber-500" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">الفئة</label>
                  <select className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none focus:border-amber-500" value={newProject.category} onChange={e => setNewProject({...newProject, category: e.target.value})}>
                    <option>متاجر</option><option>شركات</option><option>شخصي</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">لوحة الألوان</label>
                <div className="flex gap-4 p-5 bg-slate-950 border border-slate-800 rounded-2xl">
                  {['أزرق', 'ذهبي', 'أرجواني', 'أخضر'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setNewProject({...newProject, colorPalette: c})}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${newProject.colorPalette === c ? 'bg-slate-800 border-amber-500 text-white' : 'border-slate-800 text-slate-500 hover:bg-slate-900'}`}
                    >
                      <div className={`w-3 h-3 rounded-full ${c === 'ذهبي' ? 'bg-amber-500' : c === 'أزرق' ? 'bg-blue-600' : c === 'أرجواني' ? 'bg-purple-600' : 'bg-emerald-600'}`} />
                      <span className="text-xs font-bold">{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">الوسوم (Tags)</label>
                <div className="flex gap-2 mb-3">
                   <input 
                    placeholder="أضف وسماً (مثلاً: React)" 
                    className="flex-1 bg-slate-950 border border-slate-800 p-4 rounded-xl outline-none focus:border-amber-500" 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTag()}
                   />
                   <button onClick={addTag} className="bg-slate-800 px-6 rounded-xl hover:bg-slate-700"><Plus size={20}/></button>
                </div>
                <div className="flex flex-wrap gap-2">
                   {newProject.tags?.map(t => (
                     <span key={t} className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-lg text-xs">
                        {t} <button onClick={() => removeTag(t)}><X size={12} className="text-red-500"/></button>
                     </span>
                   ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">رابط الصورة</label>
                <input placeholder="URL للصورة" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none focus:border-amber-500" value={newProject.image} onChange={e => setNewProject({...newProject, image: e.target.value})} />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">وصف المشروع</label>
                <textarea placeholder="وصف موجز للمشروع" className="w-full bg-slate-950 border border-slate-800 p-5 rounded-2xl outline-none focus:border-amber-500 h-32 resize-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>

              <button onClick={handleSaveProject} className="w-full bg-amber-600 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-amber-600/20 transition-all hover:bg-amber-500">
                حفظ المشروع في قاعدة البيانات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
