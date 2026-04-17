import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ShoppingBag, Star, ShieldCheck, 
    Truck, RefreshCw, Package, CheckCircle2, 
    ArrowRight, Info, AlertTriangle 
} from 'lucide-react';
import { apiFetch, getImageUrl } from '../../utils/api';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../../data/siteData';
import SEO from '../../components/SEO';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);
        setError(false);

        apiFetch(`/products`)
            .then(res => {
                const allProducts = (res.products && res.products.length > 0) ? res.products : FALLBACK_PRODUCTS;
                const found = allProducts.find(p => p._id === id);
                if (found) {
                    setProduct(found);
                } else {
                    setError(true);
                }
            })
            .catch(() => {
                const found = FALLBACK_PRODUCTS.find(p => p._id === id);
                if (found) setProduct(found);
                else setError(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleBuyNow = () => {
        const token = localStorage.getItem('sritech_token');
        if (!token) {
            navigate('/auth?redirect=' + encodeURIComponent('/shop') + '&product=' + product._id);
            return;
        }
        navigate('/shop?product=' + product._id);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-charcoal flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-orange/20 border-t-orange rounded-full animate-spin mb-4" />
                    <p className="font-rajdhani text-silver/60 tracking-widest uppercase">Fetching Details...</p>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center p-6 text-center">
                <AlertTriangle size={64} className="text-orange mb-6" />
                <h2 className="text-3xl font-rajdhani font-bold text-white mb-2">Product Not Found</h2>
                <p className="text-silver/60 mb-8 max-w-md">The product you are looking for might have been removed or the link is incorrect.</p>
                <Link to="/" className="bg-orange text-white px-8 py-3 rounded-xl font-bold font-rajdhani tracking-widest uppercase shadow-orange-glow">
                    Back to Catalog
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal selection:bg-orange selection:text-white">
            <SEO 
                title={`${product.name} | Sri Tech Engineering`} 
                description={product.description} 
                image={getImageUrl(product.image)}
            />
            <Navbar />

            <main className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm mb-8">
                    <Link to="/" className="text-silver/40 hover:text-white transition-colors">Home</Link>
                    <span className="text-silver/20">/</span>
                    <span className="text-silver/40">{product.category}</span>
                    <span className="text-silver/20">/</span>
                    <span className="text-white font-semibold">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-12 gap-10 xl:gap-16">
                    {/* Left: Image Gallery */}
                    <div className="lg:col-span-6 xl:col-span-7">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative group rounded-3xl overflow-hidden bg-[#111825] border border-silver/10 aspect-square"
                        >
                            {product.tag && (
                                <div className="absolute top-6 left-6 z-10">
                                    <span className="bg-orange text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-widest uppercase">
                                        {product.tag}
                                    </span>
                                </div>
                            )}
                            {product.isFeatured && (
                                <div className="absolute top-6 right-6 z-10">
                                    <div className="bg-yellow-500/10 backdrop-blur-md border border-yellow-500/30 text-yellow-500 p-2 rounded-full shadow-lg">
                                        <Star fill="currentColor" size={18} />
                                    </div>
                                </div>
                            )}
                            
                            {product.image ? (
                                <img 
                                    src={getImageUrl(product.image)} 
                                    alt={product.name} 
                                    className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-silver/20">
                                    <Package size={80} strokeWidth={1} />
                                    <p className="mt-4 font-rajdhani text-lg">No Image Available</p>
                                </div>
                            )}
                            
                            {/* Visual effect */}
                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent pointer-events-none" />
                        </motion.div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="lg:col-span-6 xl:col-span-5 flex flex-col">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <span className="text-orange font-bold text-sm tracking-widest uppercase mb-2 block">
                                {product.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-rajdhani font-bold text-white mb-4 leading-tight">
                                {product.name}
                            </h1>
                            
                            <div className="flex items-center gap-4 mb-6">
                                {product.price > 0 && (
                                    <div className="text-3xl font-bold text-green-400 font-rajdhani">
                                        ₹{product.price.toLocaleString('en-IN')}
                                    </div>
                                )}
                                <div className={`px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border ${
                                    product.stock > 0 ? 'text-green-500 border-green-500/20 bg-green-500/5' : 'text-red-500 border-red-500/20 bg-red-400/5'
                                }`}>
                                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                                </div>
                            </div>

                            <p className="text-silver/70 text-lg leading-relaxed mb-8 border-l-2 border-orange/30 pl-6 py-1 italic">
                                "{product.description}"
                            </p>

                            <div className="space-y-4 mb-10">
                                <div className="flex items-center gap-3 text-silver/60">
                                    <ShieldCheck size={20} className="text-orange" />
                                    <span className="text-sm font-semibold tracking-wide">100% Quality Assurance Guarantee</span>
                                </div>
                                <div className="flex items-center gap-3 text-silver/60">
                                    <Truck size={20} className="text-orange" />
                                    <span className="text-sm font-semibold tracking-wide">Pan-India Industrial Delivery</span>
                                </div>
                                <div className="flex items-center gap-3 text-silver/60">
                                    <RefreshCw size={20} className="text-orange" />
                                    <span className="text-sm font-semibold tracking-wide">Dedicated Support & Installation</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleBuyNow}
                                    disabled={product.stock === 0}
                                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-xl font-bold font-rajdhani text-lg tracking-widest uppercase transition-all ${
                                        product.stock > 0 
                                        ? 'bg-orange text-white shadow-orange-glow hover:translate-y-[-2px] active:scale-[0.98]' 
                                        : 'bg-silver/10 text-silver/40 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingBag size={20} />
                                    {product.stock > 0 ? 'Buy & Enquire' : 'Currently Unavailable'}
                                </button>
                                <a
                                    href={`https://wa.me/919043340278?text=Hi Sri Tech, I'm interested in ${product.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-8 py-4 rounded-xl bg-[#25D366] text-white font-bold transition-all text-center shadow-lg hover:bg-[#20ba59] hover:translate-y-[-2px] active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    WhatsApp
                                </a>
                            </div>
                        </motion.div>

                        {/* Tabs Section */}
                        <div className="mt-12 bg-[#111825] rounded-3xl border border-silver/10 overflow-hidden">
                            <div className="flex border-b border-silver/10">
                                {[
                                    { id: 'description', label: 'Overview', icon: <Info size={14} /> },
                                    { id: 'specs', label: 'Technical Details', icon: <Package size={14} /> }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all ${
                                            activeTab === tab.id 
                                            ? 'text-orange bg-orange/5' 
                                            : 'text-silver/40 hover:text-white'
                                        }`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                            <div className="p-8">
                                <AnimatePresence mode="wait">
                                    {activeTab === 'description' && (
                                        <motion.div
                                            key="tab-desc"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-4"
                                        >
                                            <p className="text-silver/70 leading-relaxed font-source whitespace-pre-wrap">
                                                {product.detailedDescription || product.description + " This product is engineered with precision at Sri Tech Engineering, Namakkal. We ensure the highest standards of manufacturing for all our mechanical and civil products."}
                                            </p>
                                        </motion.div>
                                    )}
                                    {activeTab === 'specs' && (
                                        <motion.div
                                            key="tab-specs"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="space-y-3"
                                        >
                                            {product.specs && product.specs.length > 0 ? (
                                                <div className="grid grid-cols-1 gap-1">
                                                    {product.specs.map((spec, i) => (
                                                        <div key={i} className="flex justify-between py-3 border-b border-silver/5 last:border-0 hover:bg-silver/5 px-2 rounded-lg transition-colors">
                                                            <span className="text-silver/50 text-sm font-semibold">{spec.label}</span>
                                                            <span className="text-white text-sm font-bold">{spec.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <AlertTriangle size={32} className="mx-auto text-silver/20 mb-3" />
                                                    <p className="text-silver/40 italic">Technical specifications for this product will be available soon. Please contact us for more details.</p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Return Policy / Extra Info */}
                <div className="mt-20 grid md:grid-cols-3 gap-8 border-t border-silver/10 pt-16">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange flex-shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Precision Built</h4>
                            <p className="text-sm text-silver/50">Each unit undergoes rigorous multi-point quality inspections.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange flex-shrink-0">
                            <Package size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Heavy Duty Packing</h4>
                            <p className="text-sm text-silver/50">Industrial grade packaging to ensure zero damage during transit.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange flex-shrink-0">
                            <ArrowRight size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-1">Custom Orders</h4>
                            <p className="text-sm text-silver/50">Bulk order customizations available for specific site requirements.</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
