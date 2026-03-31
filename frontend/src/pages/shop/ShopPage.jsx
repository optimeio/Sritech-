import { useState, useEffect } from 'react';
 
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Building2, Package, CheckCircle2, ChevronDown, Check, CreditCard, Banknote } from 'lucide-react';
import { apiFetch, getImageUrl } from '../../utils/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';

const CATS = ['All', 'Civil', 'Mechanical', 'Eco Products'];

export default function ShopPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const buyParam = params.get('product');

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    
    // Checkout state
    const [checkoutProduct, setCheckoutProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [address, setAddress] = useState('');
    const [notes, setNotes] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    
    // User status
    const isLoggedIn = !!localStorage.getItem('sritech_token');

    useEffect(() => {
        window.scrollTo(0, 0);
        apiFetch('/products')
            .then(d => {
                setProducts(d.products || []);
                if (buyParam) {
                    const prod = d.products.find(p => p._id === buyParam);
                    if (prod && prod.stock > 0) setCheckoutProduct(prod);
                }
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, [buyParam]);

    const handleBuyClick = (product) => {
        if (!isLoggedIn) {
            navigate('/?view=auth&redirect=' + encodeURIComponent('/?view=shop') + '&product=' + product._id);
            return;
        }
        setCheckoutProduct(product);
        setQuantity(1);
        setOrderSuccess(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
            if (res.error) throw new Error(res.error);
            setOrderSuccess(res.orderId);
            setCheckoutProduct(null);
            
            // Refresh products for updated stock
            const prodRes = await apiFetch('/products');
            setProducts(prodRes.products || []);
        } catch (err) {
            alert('Order failed: ' + err.message);
        } finally {
            setCheckingOut(false);
        }
    };

    const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

    return (
        <>
            <SEO title="Shop Products | Sri Tech Engineering" description="Browse and purchase our innovative civil and mechanical engineering products." />
            <Navbar />
            
            <main className="min-h-screen bg-charcoal pt-24 pb-20 font-source text-offwhite relative overflow-hidden">
                <div className="absolute inset-0 blueprint-bg opacity-20 pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Header */}
                    {!checkoutProduct && !orderSuccess && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
                            <h1 className="font-rajdhani text-4xl md:text-5xl font-bold mb-4 drop-shadow-md">
                                Sritech <span className="text-orange">Store</span>
                            </h1>
                            <p className="text-silver/80 max-w-2xl mx-auto">
                                Premium engineering products designed for industrial, civil, and sustainable applications.
                            </p>
                            
                            {/* Filters */}
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                                {CATS.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setFilter(c)}
                                        className={`px-5 py-2 rounded-full font-bold text-sm tracking-widest uppercase transition-all ${
                                            filter === c ? 'bg-orange text-white shadow-orange-glow' : 'bg-charcoal/50 border border-silver/20 text-silver/60 hover:text-white hover:border-silver/40'
                                        }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Order Success */}
                    {orderSuccess && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto glass-card p-8 md:p-12 text-center my-12">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 mx-auto flex items-center justify-center mb-6">
                                <CheckCircle2 size={40} className="text-green-500" />
                            </div>
                            <h2 className="font-rajdhani text-3xl font-bold text-white mb-2">Order Confirmed!</h2>
                            <p className="text-silver/80 mb-6">
                                Thank you for your purchase. We have received your order and will contact you shortly for delivery confirmation.
                            </p>
                            <div className="inline-block bg-charcoal/50 border border-silver/10 rounded-xl px-6 py-4 mb-8">
                                <p className="text-xs text-silver/50 uppercase tracking-widest font-bold mb-1">Order Reference</p>
                                <p className="font-rajdhani text-2xl font-bold text-orange tracking-wider">{orderSuccess}</p>
                            </div>
                                <button
                                    onClick={() => { setOrderSuccess(null); setAddress(''); setNotes(''); navigate('/?view=shop'); }}
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
                                    {/* Product Summary */}
                                    <div className="glass-card p-6 md:p-8 rounded-2xl border border-silver/10">
                                        <h3 className="font-rajdhani text-xl font-bold text-silver/80 uppercase tracking-widest border-b border-silver/10 pb-4 mb-6 flex items-center gap-3">
                                            <Package className="text-orange" /> Order Summary
                                        </h3>
                                        
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
                                                <div className="text-sm font-semibold text-green-500 mt-1">In Stock: {checkoutProduct.stock}</div>
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

                                    {/* Shipping Form */}
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
                                    <p className="text-silver/50">There are currently no products in this category.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filtered.map(product => (
                                        <div key={product._id} className="glass-card flex flex-col rounded-2xl overflow-hidden border border-silver/10 group hover:border-orange/30 transition-all hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-orange/10 relative">
                                            
                                            {/* Badges */}
                                            <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                                {product.isFeatured && <span className="text-[10px] font-bold tracking-widest bg-yellow-500/90 text-yellow-950 px-2 py-1 rounded backdrop-blur-md uppercase">FEATURED</span>}
                                                {product.tag && <span className="text-[10px] font-bold tracking-widest bg-emerald-500/90 text-emerald-950 px-2 py-1 rounded backdrop-blur-md uppercase">{product.tag}</span>}
                                            </div>

                                            <div className="h-56 overflow-hidden bg-charcoal/80 relative">
                                                {product.image ? (
                                                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                                                ) : <div className="w-full h-full flex items-center justify-center"><Package className="text-silver/20 w-16 h-16" /></div>}
                                                
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm flex items-center justify-center">
                                                        <span className="font-rajdhani text-xl font-bold text-red-500 tracking-widest uppercase border-2 border-red-500 px-6 py-2 rounded-lg transform -rotate-12">Sold Out</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-5 flex flex-col flex-1">
                                                <div className="text-xs font-bold text-orange tracking-widest uppercase mb-2">{product.category}</div>
                                                <h3 className="font-rajdhani text-xl font-bold text-white mb-2 leading-tight">{product.name}</h3>
                                                <p className="text-sm text-silver/60 mb-5 flex-1 line-clamp-2 leading-relaxed">{product.description}</p>
                                                
                                                <div className="flex items-end justify-between mt-auto">
                                                    <div>
                                                        <div className="text-[10px] text-silver/40 font-bold uppercase tracking-widest mb-1">Price</div>
                                                        <div className="font-rajdhani text-2xl font-bold text-white leading-none">₹{product.price?.toLocaleString()}</div>
                                                    </div>
                                                    
                                                    <button 
                                                        onClick={() => handleBuyClick(product)}
                                                        disabled={product.stock === 0}
                                                        className="bg-orange hover:bg-orange/90 disabled:bg-silver/10 disabled:text-silver/40 text-white font-rajdhani font-bold px-5 py-2.5 rounded-lg tracking-widest uppercase text-sm transition-colors shadow-orange-glow disabled:shadow-none"
                                                    >
                                                        {product.stock === 0 ? 'Out' : 'Buy'}
                                                    </button>
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
        </>
    );
}
