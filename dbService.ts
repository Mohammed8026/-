
import { Project, SiteOrder } from './types';

class DatabaseService {
  private PROJECTS_KEY = 'alothmany_db_projects';
  private ORDERS_KEY = 'alothmany_db_orders';
  private SETTINGS_KEY = 'alothmany_db_settings';

  async getProjects(): Promise<Project[]> {
    const data = localStorage.getItem(this.PROJECTS_KEY);
    return data ? JSON.parse(data) : this.getInitialProjects();
  }

  async addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = await this.getProjects();
    const newProject = { ...project, id: Math.random().toString(36).substr(2, 9) };
    const updated = [newProject, ...projects];
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(updated));
    this.notifyUpdate('projectsUpdated');
    return newProject;
  }

  async deleteProject(id: string): Promise<void> {
    const projects = await this.getProjects();
    const updated = projects.filter(p => p.id !== id);
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(updated));
    this.notifyUpdate('projectsUpdated');
  }

  async getOrders(): Promise<SiteOrder[]> {
    const data = localStorage.getItem(this.ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  async saveOrder(order: Omit<SiteOrder, 'id' | 'date' | 'status'>): Promise<SiteOrder> {
    const orders = await this.getOrders();
    const newOrder: SiteOrder = {
      ...order,
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleString('ar-EG'),
      status: 'قيد الانتظار'
    };
    const updated = [newOrder, ...orders];
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
    this.notifyUpdate('ordersUpdated');
    return newOrder;
  }

  async updateOrderContent(id: string, html: string): Promise<void> {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === id ? { ...o, htmlContent: html, status: 'تم التوليد' as const } : o);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
    this.notifyUpdate('ordersUpdated');
  }

  async updateOrderStatus(id: string, status: SiteOrder['status']): Promise<void> {
    const orders = await this.getOrders();
    const updated = orders.map(o => o.id === id ? { ...o, status } : o);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
    this.notifyUpdate('ordersUpdated');
  }

  async deleteOrder(id: string): Promise<void> {
    const orders = await this.getOrders();
    const updated = orders.filter(o => o.id !== id);
    localStorage.setItem(this.ORDERS_KEY, JSON.stringify(updated));
    this.notifyUpdate('ordersUpdated');
  }

  async getSettings() {
    const data = localStorage.getItem(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : { siteName: "محمد العثماني", email: "almanswro553@gmail.com" };
  }

  private notifyUpdate(eventName: string) {
    window.dispatchEvent(new Event(eventName));
  }

  private getInitialProjects(): Project[] {
    return [
      { id: '1', title: 'متجر عطور ذكي', category: 'متاجر', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=1200', description: 'تجربة تسوق فريدة مع نظام توصية ذكي يحلل أذواق المستخدمين.', colorPalette: 'ذهبي', tags: ['E-commerce', 'Luxury', 'AI'] },
      { id: '2', title: 'منصة عقارات عصرية', category: 'شركات', image: 'https://images.unsplash.com/photo-1460472178825-e5240623abe5?auto=format&fit=crop&q=80&w=1200', description: 'نظام بحث متقدم للعقارات الفاخرة مع جولات افتراضية ثلاثية الأبعاد.', colorPalette: 'أزرق', tags: ['Real Estate', 'Dashboard', 'Modern'] },
      { id: '3', title: 'تطبيق تأمل وراحة', category: 'شخصي', image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200', description: 'واجهة هادئة تساعد المستخدم على الاسترخاء والتركيز بأسلوب مينيماليست.', colorPalette: 'أرجواني', tags: ['Mobile-First', 'Minimalist', 'Health'] },
      { id: '4', title: 'موقع نباتات ومنزل', category: 'متاجر', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=1200', description: 'متجر متخصص لبيع النباتات النادرة وتنسيق الحدائق المنزلية.', colorPalette: 'أخضر', tags: ['Nature', 'Clean', 'Retail'] },
      { id: '5', title: 'مركز طبي متطور', category: 'شركات', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200', description: 'نظام متكامل لحجز المواعيد والاستشارات الطبية عبر الإنترنت.', colorPalette: 'أزرق', tags: ['Medical', 'Booking', 'Trust'] },
      { id: '6', title: 'معرض أزياء فاخر', category: 'شخصي', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1200', description: 'بورتفوليو لعرض أحدث تصاميم الموضة العالمية بدقة عالية.', colorPalette: 'ذهبي', tags: ['Fashion', 'Creative', 'Gold'] },
      { id: '7', title: 'منصة تكنولوجيا سحابية', category: 'شركات', image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', description: 'واجهة مستقبلية تعرض خدمات الحوسبة السحابية وحلول الـ SaaS.', colorPalette: 'أرجواني', tags: ['Cloud', 'SaaS', 'High-Tech'] },
      { id: '8', title: 'وكالة سفر وسياحة', category: 'متاجر', image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200', description: 'متجر إلكتروني لحجز الباقات السياحية حول العالم بلمسة طبيعية.', colorPalette: 'أخضر', tags: ['Travel', 'Nature', 'Booking'] },
      { id: '9', title: 'مكتب هندسة معمارية', category: 'شركات', image: 'https://images.unsplash.com/photo-1487958449913-f95f00aabe67?auto=format&fit=crop&q=80&w=1200', description: 'عرض المشاريع الهندسية الضخمة بتصاميم هندسية دقيقة وجذابة.', colorPalette: 'أزرق', tags: ['Architecture', 'Corporate', 'Geometry'] },
      { id: '10', title: 'متجر ساعات فاخرة', category: 'متاجر', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200', description: 'منصة تجارة إلكترونية متخصصة في الساعات العالمية النادرة.', colorPalette: 'ذهبي', tags: ['E-commerce', 'Watches', 'Premium'] }
    ];
  }
}

export const db = new DatabaseService();
