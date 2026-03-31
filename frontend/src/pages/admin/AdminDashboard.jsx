import { useState, useEffect } from 'react';
 
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Package, Image, Tag, Plus, Edit2, Trash2, LayoutTemplate, X, Save, Eye, EyeOff, ShieldAlert, Star, ShoppingCart, Users, CheckCircle, Download, Filter, Calendar } from 'lucide-react';
import { apiFetch, getImageUrl } from '../../utils/api';
import SEO from '../../components/SEO';

const CATS = ['Civil', 'Mechanical', 'Eco Products'];
const TAGS = ['NEW', 'HOT', 'LIMITED', ''];

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);
    
    // Data
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    
    // Modals
    const [isProductModalOpen, setProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form
    const [formData, setFormData] = useState({
        name: '', description: '', category: 'Civil', price: '', stock: '100',
        isFeatured: false, tag: '', image: null
    });
    const [imagePreview, setImagePreview] = useState(null);

    // Banner Form
    const [bannerForm, setBannerForm] = useState({
        title: '', subtitle: '', buttonText: '', buttonLink: '', tag: '', isActive: true
    });

    // Date Filters
    const [orderDateFrom, setOrderDateFrom] = useState('');
    const [orderDateTo, setOrderDateTo] = useState('');
    const [customerDateFrom, setCustomerDateFrom] = useState('');
    const [customerDateTo, setCustomerDateTo] = useState('');

    // --- CSV Export Helpers ---
    const toCSV = (rows, headers) => {
        const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const headerLine = headers.map(h => escape(h.label)).join(',');
        const dataLines = rows.map(r => headers.map(h => escape(h.key(r))).join(','));
        return [headerLine, ...dataLines].join('\n');
    };
    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
    };
    const filterByDate = (items, dateField, from, to) => {
        return items.filter(item => {
            const d = new Date(item[dateField]);
            if (from && d < new Date(from)) return false;
            if (to && d > new Date(to + 'T23:59:59')) return false;
            return true;
        });
    };

    const exportOrdersCSV = (rows) => {
        const csv = toCSV(rows, [
            { label: 'Order ID',        key: o => o.orderId },
            { label: 'Product',         key: o => o.product?.name },
            { label: 'Category',        key: o => o.product?.category },
            { label: 'Quantity',        key: o => o.quantity },
            { label: 'Total (₹)',       key: o => o.totalAmount },
            { label: 'Status',          key: o => o.status },
            { label: 'Customer Name',   key: o => o.user?.name },
            { label: 'Customer Email',  key: o => o.user?.email },
            { label: 'Customer Phone',  key: o => o.user?.phone },
            { label: 'Delivery Address',key: o => o.user?.address },
            { label: 'Notes',           key: o => o.notes },
            { label: 'Order Date',      key: o => o.createdAt ? new Date(o.createdAt).toLocaleString() : '' },
        ]);
        downloadCSV(csv, `sritech_orders_${Date.now()}.csv`);
    };
    const exportCustomersCSV = (rows) => {
        const csv = toCSV(rows, [
            { label: 'Name',       key: u => u.name },
            { label: 'Email',      key: u => u.email },
            { label: 'Phone',      key: u => u.phone },
            { label: 'Joined On',  key: u => u.createdAt ? new Date(u.createdAt).toLocaleString() : '' },
        ]);
        downloadCSV(csv, `sritech_customers_${Date.now()}.csv`);
    };

    useEffect(() => {
        const token = localStorage.getItem('sritech_token');
        if (!token) {
            navigate('/admin');
            return;
        }
        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, bannerRes, ordersRes, usersRes] = await Promise.all([
                apiFetch('/products'),
                apiFetch('/banner'),
                apiFetch('/orders'),
                apiFetch('/users')
            ]);
            setProducts(prodRes.products || []);
            setOrders(ordersRes.orders || []);
            setUsers(usersRes.users || []);
            setBannerForm(bannerRes.banner || {
                title: '🔥 Mega Offer on Civil Products', subtitle: 'High Quality Engineering Solutions',
                buttonText: 'Enquire Now', buttonLink: 'https://wa.me/919043340278',
                tag: 'Limited Offer', isActive: true
            });
        } catch (err) {
            console.error(err);
            if (err.message.includes('token') || err.message.includes('Forbidden')) {
                localStorage.removeItem('sritech_token');
                window.location.href = '/admin';
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('sritech_token');
        window.location.href = '/admin';
    };

    // --- Products ---
    const openProductModal = (prod = null) => {
        if (prod) {
            setEditingProduct(prod);
            setFormData({
                name: prod.name, description: prod.description, category: prod.category,
                price: prod.price || '', stock: prod.stock || 0,
                isFeatured: prod.isFeatured, tag: prod.tag || '', image: null
            });
            setImagePreview(getImageUrl(prod.image));
        } else {
            setEditingProduct(null);
            setFormData({
                name: '', description: '', category: 'Civil', price: '', stock: '100',
                isFeatured: false, tag: '', image: null
            });
            setImagePreview(null);
        }
        setProductModalOpen(true);
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append('name', formData.name);
            formDataObj.append('description', formData.description);
            formDataObj.append('category', formData.category);
            formDataObj.append('price', formData.price);
            formDataObj.append('stock', formData.stock);
            formDataObj.append('isFeatured', formData.isFeatured);
            formDataObj.append('tag', formData.tag);
            if (formData.image) formDataObj.append('image', formData.image);

            const options = {
                method: editingProduct ? 'PUT' : 'POST',
                // Don't set Content-Type, let browser set it with boundary for FormData
                body: formDataObj,
            };

            await apiFetch(editingProduct ? `/products/${editingProduct._id}` : '/products', options);
            await fetchData();
            setProductModalOpen(false);
        } catch (err) {
            alert('Error saving product: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            await apiFetch(`/products/${id}`, { method: 'DELETE' });
            await fetchData();
        } catch {
            alert('Error deleting product');
        }
    };

    // --- Orders ---
    const handleUpdateOrderStatus = async (id, status) => {
        try {
            await apiFetch(`/orders/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            await fetchData();
        } catch {
            alert('Error updating order status');
        }
    };

    // --- Banner ---
    const handleBannerSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await apiFetch('/banner', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bannerForm)
            });
            await fetchData();
            alert('Banner updated successfully!');
        } catch (err) {
            alert('Error updating banner: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange/30 border-t-orange rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-charcoal text-offwhite font-source selection:bg-orange selection:text-white">
            <SEO title="Admin Dashboard" description="Manage Sritech Products and Banner." />

            {/* Topbar */}
            <header className="fixed top-0 inset-x-0 h-16 bg-charcoal/90 backdrop-blur-md border-b border-silver/10 z-30 flex items-center justify-between px-6">
                <div className="flex items-center gap-3">
                    <ShieldAlert className="text-orange" size={24} />
                    <h1 className="font-rajdhani text-xl font-bold tracking-widest uppercase hidden sm:block">
                        Sritech Control Panel
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/')}
                        className="text-silver/60 hover:text-orange text-sm font-semibold tracking-wide transition-colors"
                    >
                        View Site↗
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div className="pt-16 max-w-7xl mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
                {/* Sidebar */}
                <aside className="w-full md:w-64 border-r border-silver/10 p-6 flex flex-col gap-4">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'products' ? 'bg-orange/10 text-orange border border-orange/30' : 'text-silver/70 hover:bg-silver/5 border border-transparent'
                        }`}
                    >
                        <Package size={20} /> Manage Products
                    </button>
                    <button
                        onClick={() => setActiveTab('banner')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'banner' ? 'bg-orange/10 text-orange border border-orange/30' : 'text-silver/70 hover:bg-silver/5 border border-transparent'
                        }`}
                    >
                        <LayoutTemplate size={20} /> Promo Banner
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'orders' ? 'bg-orange/10 text-orange border border-orange/30' : 'text-silver/70 hover:bg-silver/5 border border-transparent'
                        }`}
                    >
                        <ShoppingCart size={20} /> Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-3 p-3 rounded-xl font-semibold transition-all ${
                            activeTab === 'users' ? 'bg-orange/10 text-orange border border-orange/30' : 'text-silver/70 hover:bg-silver/5 border border-transparent'
                        }`}
                    >
                        <Users size={20} /> Customers
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-10 relative">
                    {activeTab === 'products' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="font-rajdhani text-3xl font-bold">Products Directory</h2>
                                    <p className="text-silver/60 mt-1">Manage your catalog, stock and pricing.</p>
                                </div>
                                <button
                                    onClick={() => openProductModal()}
                                    className="bg-orange hover:bg-orange/90 text-white font-rajdhani font-bold px-5 py-2.5 rounded-lg shadow-orange-glow flex items-center gap-2 transition-transform active:scale-95"
                                >
                                    <Plus size={20} /> Add Product
                                </button>
                            </div>

                            <div className="bg-[#111825] border border-silver/10 rounded-2xl overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-silver/5 text-silver/60 font-semibold text-xs tracking-widest uppercase">
                                            <th className="p-4 rounded-tl-2xl">Product</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4">Price/Stock</th>
                                            <th className="p-4">Tags</th>
                                            <th className="p-4 rounded-tr-2xl text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-silver/10">
                                        {products.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="p-8 text-center text-silver/50">No products found. Add your first product.</td>
                                            </tr>
                                        )}
                                        {products.map(p => (
                                            <tr key={p._id} className="hover:bg-silver/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-charcoal rounded-lg overflow-hidden border border-silver/10 flex-shrink-0">
                                                            {p.image ? (
                                                                <img src={getImageUrl(p.image)} alt={p.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Image className="w-full h-full p-3 text-silver/20" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-offwhite truncate max-w-[200px]">{p.name}</div>
                                                            <div className="text-xs text-silver/60 line-clamp-1 max-w-[200px]">{p.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm font-semibold text-silver/80">{p.category}</td>
                                                <td className="p-4 text-sm font-semibold text-silver/80">
                                                    <div className="text-orange">₹{p.price || 0}</div>
                                                    <div className="text-xs mt-0.5 text-silver/60">Stock: {p.stock}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex gap-2 text-xs font-bold">
                                                        {p.isFeatured && <span className="text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded border border-yellow-500/20">★ FEATURED</span>}
                                                        {p.tag && <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">{p.tag}</span>}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => openProductModal(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit">
                                                            <Edit2 size={18} />
                                                        </button>
                                                        <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'banner' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
                            <div className="flex justify-between items-end mb-8">
                                <div>
                                    <h2 className="font-rajdhani text-3xl font-bold">Promotional Banner</h2>
                                    <p className="text-silver/60 mt-1">This banner appears at the top of the Products section.</p>
                                </div>
                                <button
                                    onClick={() => setBannerForm({ ...bannerForm, isActive: !bannerForm.isActive })}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                                        bannerForm.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'
                                    }`}
                                >
                                    {bannerForm.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
                                    {bannerForm.isActive ? 'Banner Visible' : 'Banner Hidden'}
                                </button>
                            </div>

                            <form onSubmit={handleBannerSubmit} className="glass-card p-6 md:p-8 space-y-6">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Banner Title</label>
                                            <input type="text" value={bannerForm.title} onChange={e => setBannerForm({...bannerForm, title: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 focus:ring-orange outline-none" required />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Subtitle</label>
                                            <textarea value={bannerForm.subtitle} onChange={e => setBannerForm({...bannerForm, subtitle: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-none" rows="2" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Button Text</label>
                                            <input type="text" value={bannerForm.buttonText} onChange={e => setBannerForm({...bannerForm, buttonText: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 focus:ring-orange outline-none" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Optional Tag</label>
                                            <input type="text" placeholder="e.g. Limited Offer" value={bannerForm.tag} onChange={e => setBannerForm({...bannerForm, tag: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 focus:ring-orange outline-none" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Button Link / WhatsApp URL</label>
                                            <input type="url" value={bannerForm.buttonLink} onChange={e => setBannerForm({...bannerForm, buttonLink: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 focus:ring-orange outline-none" required />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" disabled={saving} className="w-full bg-orange hover:bg-orange/90 text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl transition-all shadow-orange-glow disabled:opacity-50 flex items-center justify-center gap-2">
                                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save size={20} /> Save Banner Config</>}
                                </button>
                            </form>
                        </motion.div>
                    )}

                    {activeTab === 'orders' && (() => {
                        const filtered = filterByDate(orders, 'createdAt', orderDateFrom, orderDateTo);
                        return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="font-rajdhani text-3xl font-bold">Recent Orders</h2>
                                    <p className="text-silver/60 mt-1">Manage Cash on Delivery and fulfilled orders.</p>
                                </div>
                                <button
                                    onClick={() => exportOrdersCSV(filtered)}
                                    className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors"
                                >
                                    <Download size={16} /> Export CSV ({filtered.length})
                                </button>
                            </div>

                            {/* Date Filter Bar */}
                            <div className="flex flex-wrap items-center gap-3 bg-[#111825] border border-silver/10 rounded-xl p-4 mb-4">
                                <Calendar size={16} className="text-silver/50 flex-shrink-0" />
                                <span className="text-xs text-silver/60 font-semibold uppercase tracking-widest">Filter by Date:</span>
                                <div className="flex flex-wrap items-center gap-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-silver/50">From</label>
                                        <input
                                            type="date"
                                            value={orderDateFrom}
                                            onChange={e => setOrderDateFrom(e.target.value)}
                                            className="bg-charcoal/50 border border-silver/15 text-offwhite text-xs rounded-lg px-3 py-2 focus:border-orange outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-silver/50">To</label>
                                        <input
                                            type="date"
                                            value={orderDateTo}
                                            onChange={e => setOrderDateTo(e.target.value)}
                                            className="bg-charcoal/50 border border-silver/15 text-offwhite text-xs rounded-lg px-3 py-2 focus:border-orange outline-none"
                                        />
                                    </div>
                                    {(orderDateFrom || orderDateTo) && (
                                        <button
                                            onClick={() => { setOrderDateFrom(''); setOrderDateTo(''); }}
                                            className="text-xs text-orange hover:text-orange/70 font-semibold transition-colors"
                                        >
                                            ✕ Clear
                                        </button>
                                    )}
                                </div>
                                <span className="text-xs text-silver/40 ml-auto">{filtered.length} of {orders.length} orders</span>
                            </div>

                            <div className="bg-[#111825] border border-silver/10 rounded-2xl overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-silver/5 text-silver/60 font-semibold text-xs tracking-widest uppercase">
                                            <th className="p-4 rounded-tl-2xl">Order ID &amp; Item</th>
                                            <th className="p-4">Customer Details</th>
                                            <th className="p-4">Total Amount</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4 rounded-tr-2xl text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-silver/10">
                                        {filtered.length === 0 && (
                                            <tr><td colSpan="5" className="p-8 text-center text-silver/50">
                                                {orders.length === 0 ? 'No orders placed yet.' : 'No orders match the selected date range.'}
                                            </td></tr>
                                        )}
                                        {filtered.map(o => (
                                            <tr key={o._id} className="hover:bg-silver/5 transition-colors group">
                                                <td className="p-4">
                                                    <div className="font-bold text-orange text-sm tracking-widest uppercase mb-1">{o.orderId}</div>
                                                    <div className="font-semibold text-white truncate max-w-[200px]">{o.product.name}</div>
                                                    <div className="text-xs text-silver/60 mt-0.5">Qty: {o.quantity}</div>
                                                    {o.createdAt && <div className="text-xs text-silver/40 mt-0.5">{new Date(o.createdAt).toLocaleDateString()}</div>}
                                                </td>
                                                <td className="p-4 text-sm text-silver/80">
                                                    <div className="font-semibold text-white">{o.user.name}</div>
                                                    <div className="text-xs">{o.user.email}</div>
                                                    <div className="text-xs text-silver/50 max-w-[200px] truncate">{o.user.address}</div>
                                                    {o.user.phone && <div className="text-xs text-blue-400 mt-0.5">{o.user.phone}</div>}
                                                </td>
                                                <td className="p-4 text-sm font-bold text-white">₹{o.totalAmount.toLocaleString()}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold border uppercase tracking-widest ${
                                                        o.status === 'delivered' ? 'text-green-500 bg-green-500/10 border-green-500/20' :
                                                        o.status === 'shipped' ? 'text-blue-500 bg-blue-500/10 border-blue-500/20' :
                                                        o.status === 'cancelled' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                                                    }`}>{o.status}</span>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <select value={o.status} onChange={e => handleUpdateOrderStatus(o._id, e.target.value)} className="bg-charcoal border border-silver/20 text-silver/80 text-xs rounded p-1.5 focus:border-orange outline-none">
                                                        <option value="pending">Pending</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                        );
                    })()}

                    {activeTab === 'users' && (() => {
                        const filtered = filterByDate(users, 'createdAt', customerDateFrom, customerDateTo);
                        return (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                                <div>
                                    <h2 className="font-rajdhani text-3xl font-bold">Registered Customers</h2>
                                    <p className="text-silver/60 mt-1">Verified customer accounts.</p>
                                </div>
                                <button
                                    onClick={() => exportCustomersCSV(filtered)}
                                    className="flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 px-4 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-colors"
                                >
                                    <Download size={16} /> Export CSV ({filtered.length})
                                </button>
                            </div>

                            {/* Date Filter Bar */}
                            <div className="flex flex-wrap items-center gap-3 bg-[#111825] border border-silver/10 rounded-xl p-4 mb-4">
                                <Calendar size={16} className="text-silver/50 flex-shrink-0" />
                                <span className="text-xs text-silver/60 font-semibold uppercase tracking-widest">Filter by Join Date:</span>
                                <div className="flex flex-wrap items-center gap-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-silver/50">From</label>
                                        <input
                                            type="date"
                                            value={customerDateFrom}
                                            onChange={e => setCustomerDateFrom(e.target.value)}
                                            className="bg-charcoal/50 border border-silver/15 text-offwhite text-xs rounded-lg px-3 py-2 focus:border-orange outline-none"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-silver/50">To</label>
                                        <input
                                            type="date"
                                            value={customerDateTo}
                                            onChange={e => setCustomerDateTo(e.target.value)}
                                            className="bg-charcoal/50 border border-silver/15 text-offwhite text-xs rounded-lg px-3 py-2 focus:border-orange outline-none"
                                        />
                                    </div>
                                    {(customerDateFrom || customerDateTo) && (
                                        <button
                                            onClick={() => { setCustomerDateFrom(''); setCustomerDateTo(''); }}
                                            className="text-xs text-orange hover:text-orange/70 font-semibold transition-colors"
                                        >
                                            ✕ Clear
                                        </button>
                                    )}
                                </div>
                                <span className="text-xs text-silver/40 ml-auto">{filtered.length} of {users.length} customers</span>
                            </div>

                            <div className="bg-[#111825] border border-silver/10 rounded-2xl overflow-hidden overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-silver/5 text-silver/60 font-semibold text-xs tracking-widest uppercase">
                                            <th className="p-4 rounded-tl-2xl">Name</th>
                                            <th className="p-4">Email Address</th>
                                            <th className="p-4">Phone Number</th>
                                            <th className="p-4 rounded-tr-2xl">Joined On</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-silver/10">
                                        {filtered.length === 0 && (
                                            <tr><td colSpan="4" className="p-8 text-center text-silver/50">
                                                {users.length === 0 ? 'No verified customers yet.' : 'No customers match the selected date range.'}
                                            </td></tr>
                                        )}
                                        {filtered.map(u => (
                                            <tr key={u._id} className="hover:bg-silver/5 transition-colors">
                                                <td className="p-4 font-bold text-white">{u.name}</td>
                                                <td className="p-4 text-sm text-silver/80">{u.email}</td>
                                                <td className="p-4 text-sm text-silver/80">{u.phone || 'N/A'}</td>
                                                <td className="p-4 text-xs text-silver/60">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                        );
                    })()}
                </main>
            </div>

            {/* Product Modal */}
            <AnimatePresence>
                {isProductModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm" onClick={() => setProductModalOpen(false)} />
                        
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-[#111825] border border-silver/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-6 border-b border-silver/10 bg-charcoal/50">
                                <h3 className="font-rajdhani text-2xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                <button onClick={() => setProductModalOpen(false)} className="p-2 hover:bg-silver/10 rounded-lg transition-colors text-silver/60 hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <form id="prod-form" onSubmit={handleProductSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Product Name</label>
                                            <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none font-semibold text-offwhite" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Description</label>
                                            <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none resize-none font-source" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Category</label>
                                            <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none appearance-none">
                                                {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Tag (Optional)</label>
                                            <select value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none appearance-none">
                                                {TAGS.map(t => <option key={t} value={t}>{t === '' ? 'None' : t}</option>)}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Price (₹)</label>
                                            <input type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none" />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Stock Quantity</label>
                                            <input type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange focus:ring-1 outline-none" />
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Product Image</label>
                                            <div className="border-2 border-dashed border-silver/20 rounded-xl p-4 text-center hover:border-orange/50 transition-colors relative group">
                                                <input type="file" accept="image/*" onChange={e => {
                                                    const f = e.target.files[0];
                                                    if(f) { setFormData({...formData, image: f}); setImagePreview(URL.createObjectURL(f)); }
                                                }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                                {imagePreview ? (
                                                    <div className="h-40 w-full rounded-lg overflow-hidden relative">
                                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-contain bg-charcoal" />
                                                        <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="font-bold tracking-widest">CHANGE IMAGE</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="py-8"><Image size={32} className="mx-auto text-silver/40 mb-3" /><p className="text-silver/60">Click or drag image here</p></div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 flex items-center justify-between">
                                            <div>
                                                <div className="font-bold text-yellow-500 mb-1 flex items-center gap-2"><Star size={16} fill="currentColor" /> Feature Product</div>
                                                <div className="text-sm text-silver/70">Show first on site with glowing border.</div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" checked={formData.isFeatured} onChange={e => setFormData({...formData, isFeatured: e.target.checked})} className="sr-only peer" />
                                                <div className="w-11 h-6 bg-charcoal rounded-full peer peer-checked:bg-yellow-500 peer-focus:ring-2 peer-focus:ring-yellow-500/50 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="p-6 border-t border-silver/10 bg-charcoal/50 flex justify-end gap-3">
                                <button type="button" onClick={() => setProductModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-silver hover:bg-silver/10 transition-colors">Cancel</button>
                                <button type="submit" form="prod-form" disabled={saving} className="bg-orange hover:bg-orange/90 text-white font-rajdhani font-bold px-8 py-3 rounded-xl shadow-orange-glow disabled:opacity-50 tracking-widest uppercase transition-all flex items-center gap-2">
                                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />} {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
