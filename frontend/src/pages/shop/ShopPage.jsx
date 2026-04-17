import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ShoppingBag, 
    ArrowLeft, 
    Check, 
    X, 
    Package, 
    Building2, 
    Banknote, 
    Star,
    ArrowRight,
    Search,
    Filter
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { apiFetch, getImageUrl } from '../../utils/api';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../../data/siteData';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const CATS = ['All', 'Civil', 'Mechanical', 'Eco Products'];

export default function ShopPage() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');
    const [search, setSearch] = useState('');
    
    const [checkoutProduct, setCheckoutProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderId, setOrderId] = useState('');

    useEffect(() => {
        window.scrollTo(0,0);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const data = await apiFetch('/products');
            if (data.products?.length > 0) {
                setProducts(data.products);
                checkURLParams(data.products);
            } else {
                setProducts(FALLBACK_PRODUCTS);
                checkURLParams(FALLBACK_PRODUCTS);
            }
        } catch {
            setProducts(FALLBACK_PRODUCTS);
            checkURLParams(FALLBACK_PRODUCTS);
        } finally {
            setLoading(false);
        }
    };

    const checkURLParams = (prodList) => {
        const params = new URLSearchParams(location.search);
        const pId = params.get('product');
        if (pId) {
            const p = prodList.find(x => x._id === pId);
            if (p && p.stock > 0) setCheckoutProduct(p);
        }
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setCheckingOut(true);
        try {
            const res = await apiFetch('/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: checkoutProduct._id,
                    quantity,
                    address,
                    notes
                })
            });
            setOrderId(res.orderId);
            setOrderSuccess(true);
            window.scrollTo(0,0);
        } catch (err) {
            alert(err.message || 'Failed to place order');
        } finally {
            setCheckingOut(false);
        }
    };

    const filtered = products.filter(p => {
        const matchesCat = category === 'All' || p.category === category;
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                             p.description.toLowerCase().includes(search.toLowerCase());
        return matchesCat && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-charcoal text-offwhite overflow-x-hidden">
            <SEO 
                title="Shop Sritech Engineering | Heavy Machinery & Materials" 
                description="Browse our catalog of precision-engineered industrial equipment, poultry machinery, PEB components, and eco-friendly products. Quality guaranteed."
            />
            <Navbar />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    {!checkoutProduct && !orderSuccess && (
                        <div className="mb-12">
                            <h1 className="text-4xl md:text-6xl font-rajdhani font-bold mb-4 tracking-tight">
                                Industrial <span className="text-orange">Catalog</span>
                            </h1>
                            <p className="text-silver/60 max-w-2xl text-lg font-source">Premium engineering solutions for Civil, Mechanical, and Eco-friendly projects.</p>
                            
                            {/* Search & Filter Bar */}
                            <div className="mt-10 flex flex-col md:flex-row gap-4 items-center">
                                <div className="relative w-full md:max-w-md group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-silver/30 group-focus-within:text-orange transition-colors" size={20} />
                                    <input 
                                        type="text" 
                                        placeholder="Search by name or keyword..."
                                        value={search}
                                        onChange={e => setSearch(e.target.value)}
                                        className="w-full bg-[#111825] border border-silver/10 rounded-2xl py-4 pl-12 pr-4 focus:border-orange outline-none transition-all placeholder:text-silver/20 font-source"
                                    />
                                </div>
                                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                                    {CATS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setCategory(c)}
                                            className={`px-6 py-4 rounded-2xl font-bold font-rajdhani tracking-widest uppercase text-xs transition-all whitespace-nowrap border ${
                                                category === c ? 'bg-orange text-white border-orange shadow-orange-glow' : 'bg-silver/5 text-silver/40 border-silver/10 hover:border-silver/30 hover:text-white'
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Message */}
                    {orderSuccess && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 max-w-2xl mx-auto">
                            <div className="w-24 h-24 bg-green-500/10 border-2 border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-8">
                                <Check size={48} className="text-green-500" />
                            </div>
                            <h2 className="text-4xl font-rajdhani font-bold text-white mb-4">Order Confirmed!</h2>
                            <p className="text-silver/60 mb-2 font-source text-lg">Thank you for your order. ID: <strong className="text-orange">{orderId}</strong></p>
                            <p className="text-silver/40 mb-10 font-source">Our team will contact you within 24 business hours to coordinate delivery.</p>
                            <button 
                                onClick={() => { setOrderSuccess(false); setCheckoutProduct(null); fetchData(); }}
                                className="w-full sm:w-auto bg-orange text-white font-rajdhani font-bold px-8 py-3.5 rounded-xl uppercase tracking-widest hover:bg-orange/90 transition-all shadow-orange-glow"
                            >
                                Continue Shopping
                            </button>
                        </motion.div>
                    )}

                    {/* Checkout Form */}
                    <AnimatePresence>
                        {checkoutProduct && !orderSuccess && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-16">
                                <button onClick={() => setCheckoutProduct(null)} className="flex items-center gap-2 text-silver/60 hover:text-white mb-6 font-bold text-sm tracking-widest uppercase transition-colors">
                                    <ArrowLeft size={16} /> Back to Catalog
                                </button>
                                
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    <div className="glass-card p-6 md:p-8 rounded-2xl border border-silver/10">
                                        <h2 className="font-rajdhani text-xl font-bold text-silver/80 uppercase tracking-widest border-b border-silver/10 pb-4 mb-6 flex items-center gap-3">
                                            <Package className="text-orange" /> Order Summary
                                        </h2>
                                        
                                        <div className="flex flex-col sm:flex-row gap-6 mb-6">
                                            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-charcoal/80 flex-shrink-0 border border-silver/10">
                                                {checkoutProduct.image ? (
                                                    <img src={getImageUrl(checkoutProduct.image)} alt={checkoutProduct.name} className="w-full h-full object-cover" />
                                                ) : <Package className="w-full h-full p-8 text-silver/20" />}
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <div className="text-xs text-orange font-bold tracking-widest uppercase mb-1">{checkoutProduct.category}</div>
                                                <h4 className="font-rajdhani text-2xl font-bold text-white mb-2 leading-tight">{checkoutProduct.name}</h4>
                                                <div className="font-rajdhani text-xl font-bold text-silver/90">₹{checkoutProduct.price?.toLocaleString() || 0}</div>
                                            </div>
                                        </div>

                                        <div className="bg-charcoal/40 rounded-xl p-5 border border-silver/5">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-silver/70 font-semibold">Quantity</span>
                                                <div className="flex items-center bg-charcoal rounded-lg border border-silver/20">
                                                    <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-1 font-bold text-silver/60 hover:text-white hover:bg-silver/10 rounded-l-lg">-</button>
                                                    <span className="px-4 py-1 font-bold text-center min-w-[3rem] border-x border-silver/20">{quantity}</span>
                                                    <button type="button" onClick={() => setQuantity(Math.min(checkoutProduct.stock, quantity + 1))} className="px-3 py-1 font-bold text-silver/60 hover:text-white hover:bg-silver/10 rounded-r-lg">+</button>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-silver/10">
                                                <span className="text-lg font-bold text-white">Total Amount</span>
                                                <span className="font-rajdhani text-2xl font-bold text-orange">₹{(checkoutProduct.price * quantity).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <form onSubmit={handlePlaceOrder} className="glass-card p-6 md:p-8 rounded-2xl border border-silver/10">
                                        <h3 className="font-rajdhani text-xl font-bold text-silver/80 uppercase tracking-widest border-b border-silver/10 pb-4 mb-6 flex items-center gap-3">
                                            <Building2 className="text-orange" /> Shipping Details
                                        </h3>
                                        <div className="space-y-5">
                                            <div>
                                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Complete Delivery Address</label>
                                                <textarea required value={address} onChange={e => setAddress(e.target.value)} rows="3" className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange outline-none resize-none placeholder:text-silver/30 font-source" placeholder="Door No, Street Name, City, Pincode" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Special Instructions (Optional)</label>
                                                <input type="text" value={notes} onChange={e => setNotes(e.target.value)} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 px-4 focus:border-orange outline-none placeholder:text-silver/30 font-source" placeholder="e.g. Call before delivery" />
                                            </div>
                                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex gap-3 text-sm text-green-400">
                                                <Banknote size={20} className="flex-shrink-0" />
                                                <p className="leading-relaxed"><strong className="font-bold">Cash on Delivery (COD):</strong> Secure your order online now. Payment will be collected in full via cash upon successful delivery.</p>
                                            </div>
                                            <button type="submit" disabled={checkingOut || !address.trim()} className="w-full bg-orange text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-4 rounded-xl shadow-orange-glow disabled:opacity-50 hover:bg-orange/90 transition-all flex justify-center items-center gap-2 mt-4">
                                                {checkingOut ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={20} /> Place COD Order</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Product Catalog view */}
                    {!checkoutProduct && !orderSuccess && (
                        <>
                            {loading ? (
                                <div className="flex justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-orange/30 border-t-orange rounded-full animate-spin" />
                                </div>
                            ) : filtered.length === 0 ? (
                                <div className="text-center py-24 glass-card border border-silver/10 rounded-2xl max-w-2xl mx-auto">
                                    <ShoppingBag size={48} className="text-silver/20 mx-auto mb-4" />
                                    <h3 className="font-rajdhani text-2xl font-bold mb-2">No Products Available</h3>
                                    <p className="text-silver/50">There are currently no products matching your search or category.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filtered.map(product => (
                                        <div key={product._id} className="glass-card flex flex-col rounded-2xl overflow-hidden border border-silver/10 group hover:border-orange/30 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-orange/10 relative">
                                            
                                            <Link to={`/product/${product._id}`} className="block relative h-48 overflow-hidden bg-charcoal/50">
                                                {product.image ? (
                                                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                ) : <Package className="w-full h-full p-12 text-silver/10" />}
                                                
                                                {product.tag && (
                                                    <div className="absolute top-3 left-3 bg-red text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                                        {product.tag}
                                                    </div>
                                                )}
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                                        <span className="text-white font-rajdhani font-bold text-sm tracking-widest uppercase">Out of Stock</span>
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-silver/40 uppercase tracking-widest">{product.category}</span>
                                                    {product.isFeatured && <Star size={14} className="text-orange" fill="currentColor" />}
                                                </div>
                                                
                                                <Link to={`/product/${product._id}`} className="block group/link">
                                                    <h4 className="font-rajdhani text-xl font-bold text-white mb-2 line-clamp-1 group-hover/link:text-orange transition-colors">{product.name}</h4>
                                                </Link>
                                                
                                                <p className="text-silver/60 text-xs line-clamp-2 mb-4 font-source flex-1">{product.description}</p>
                                                
                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-silver/10">
                                                    <div className="font-rajdhani text-xl font-bold text-white">₹{product.price?.toLocaleString() || 0}</div>
                                                    <div className="flex gap-2">
                                                        <Link to={`/product/${product._id}`} className="p-2.5 bg-silver/5 hover:bg-silver/10 text-silver/60 hover:text-white rounded-xl transition-all" title="View Details">
                                                            <ArrowRight size={18} />
                                                        </Link>
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setCheckoutProduct(product); }} 
                                                            disabled={product.stock === 0}
                                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 shadow-md ${product.stock === 0 ? 'bg-silver/5 text-silver/20 cursor-not-allowed' : 'text-white hover:translate-y-[-2px] active:scale-95 hover:shadow-orange-glow/30'}`}
                                                            style={{
                                                                background: product.stock === 0 ? 'transparent' : 'linear-gradient(135deg, #ff6b2b, #ef4444)',
                                                            }}
                                                        >
                                                            <ShoppingBag size={16} />
                                                            <span className="text-[10px] font-bold uppercase tracking-widest">{product.stock === 0 ? 'Out' : 'Buy Now'}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
