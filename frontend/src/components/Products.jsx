import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, Layers, Package, ChevronRight, Eye } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch, getImageUrl } from '../utils/api';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/siteData';

function ProductBanner() {
    const [banner, setBanner] = useState(null);

    useEffect(() => {
        apiFetch('/banner').then(d => {
            if (d.banner && d.banner.isActive) setBanner(d.banner);
        }).catch(() => {});
    }, []);

    if (!banner) return null;

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="w-full bg-gradient-to-r from-red to-orange group relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10 blueprint-bg animate-pulse" />
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest">{banner.tag || 'Notice'}</span>
                    <p className="text-white font-rajdhani font-bold text-sm sm:text-base tracking-wide">
                        {banner.title} <span className="hidden md:inline text-white/70 font-medium ml-2">— {banner.subtitle}</span>
                    </p>
                </div>
                <a 
                    href={banner.buttonLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-white text-red font-rajdhani font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full hover:bg-black hover:text-white transition-all shadow-lg"
                >
                    {banner.buttonText}
                </a>
            </div>
        </motion.div>
    );
}

function ProductCard({ product, onBuyNow }) {
    const [imgError, setImgError] = useState(false);
    const imgSrc = getImageUrl(product.image);

    const tagStyle = product.tag === 'NEW' ? { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', border: 'rgba(34,197,94,0.3)' } :
                    product.tag === 'HOT' ? { bg: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'rgba(239,68,68,0.3)' } :
                    product.tag === 'LIMITED' ? { bg: 'rgba(234,179,8,0.15)', color: '#eab308', border: 'rgba(234,179,8,0.3)' } : null;

    const catColor = product.category === 'Civil' ? '#3b82f6' : 
                    product.category === 'Mechanical' ? '#ef4444' : '#22c55e';

    return (
        <motion.article
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative flex flex-col bg-[#0f1117] border border-silver/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-orange/40 hover:shadow-orange-glow/10"
        >
            {/* Image Area */}
            <div className="relative h-48 overflow-hidden bg-[#111825]">
                <Link to={`/product/${product._id}`} className="block h-full w-full">
                    {imgSrc && !imgError ? (
                        <img
                            src={imgSrc}
                            alt={product.name}
                            onError={() => setImgError(true)}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-silver/10">
                            <Package size={48} />
                        </div>
                    )}
                </Link>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
                    {product.tag && tagStyle && (
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border shadow-lg" style={{ background: tagStyle.bg, color: tagStyle.color, borderColor: tagStyle.border }}>
                            {product.tag}
                        </span>
                    )}
                </div>
                
                {product.isFeatured && (
                    <div className="absolute top-3 right-3 pointer-events-none">
                        <div className="bg-yellow-500 text-black p-1.5 rounded-full shadow-lg border border-yellow-300/50">
                            <Star size={12} fill="currentColor" />
                        </div>
                    </div>
                )}

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="text-white font-rajdhani font-bold tracking-[0.2em] text-sm uppercase px-4 py-2 border-y border-white/20">Out of Stock</span>
                    </div>
                )}
                
                {/* View Details Overlay */}
                <Link to={`/product/${product._id}`} className="absolute bottom-3 left-3 right-3 bg-charcoal/80 backdrop-blur-md border border-silver/10 rounded-lg py-1.5 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <Eye size={14} className="text-orange" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Full Details</span>
                </Link>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Layers size={12} style={{ color: catColor }} />
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: catColor }}>{product.category}</span>
                </div>

                <Link to={`/product/${product._id}`} className="block group/link">
                    <h3 className="text-white font-rajdhani font-bold text-xl mb-2 group-hover/link:text-orange transition-colors line-clamp-1">
                        {product.name}
                    </h3>
                </Link>

                <p className="text-silver/50 text-xs leading-relaxed line-clamp-3 mb-6 flex-1 font-source">
                    {product.description}
                </p>

                <div className="space-y-4 pt-4 border-t border-silver/5">
                    <div className="flex items-center justify-between">
                        <div>
                            {product.price > 0 && (
                                <div className="text-lg font-bold text-green-400 font-rajdhani tracking-wide">
                                    ₹{product.price.toLocaleString('en-IN')}
                                </div>
                            )}
                            <span className="text-[10px] text-silver/40 font-semibold tracking-wide uppercase">Industrial Grade</span>
                        </div>
                        <div className="text-[10px] text-silver/30 font-bold uppercase">Stock: {product.stock}</div>
                    </div>
                    
                    <button
                        onClick={(e) => { e.preventDefault(); onBuyNow(product); }}
                        disabled={product.stock === 0}
                        className={`w-full py-3.5 flex items-center justify-center gap-2 rounded-xl font-rajdhani font-bold tracking-widest uppercase text-xs transition-all duration-300 ${
                            product.stock === 0 
                            ? 'bg-silver/5 text-silver/20 cursor-not-allowed' 
                            : 'text-white hover:translate-y-[-2px] active:scale-95 shadow-lg hover:shadow-orange-glow/40'
                        }`}
                        style={{
                            background: product.stock === 0 ? 'transparent' : 'linear-gradient(135deg, #ff6b2b, #ef4444)',
                            boxShadow: product.stock === 0 ? 'none' : '0 4px 15px rgba(255, 107, 43, 0.25)'
                        }}
                        aria-label={`Buy ${product.name}`}
                    >
                        <ShoppingBag size={16} />
                        {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(4);
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch('/products')
            .then(d => {
                if (d.products?.length > 0) setProducts(d.products);
                else setProducts(FALLBACK_PRODUCTS);
            })
            .catch(() => setProducts(FALLBACK_PRODUCTS))
            .finally(() => setLoading(false));
    }, []);

    const handleBuyNow = (product) => {
        const token = localStorage.getItem('sritech_token');
        if (!token) {
            navigate('/auth?redirect=' + encodeURIComponent('/shop') + '&product=' + product._id);
            return;
        }
        navigate('/shop?product=' + product._id);
    };

    const visibleProducts = products.slice(0, visibleCount);

    return (
        <section id="products" className="relative py-20 bg-[#0a0a0a]">
            {/* Structural grid bg */}
            <div className="absolute inset-0 blueprint-bg opacity-[0.03]" />
            <ProductBanner />
            
            <div ref={ref} className="max-w-7xl mx-auto px-4 mt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/20 px-3 py-1 rounded-full mb-4">
                        <Star size={12} className="text-orange" fill="currentColor" />
                        <span className="text-xs font-bold text-orange uppercase tracking-widest">Our Machines</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-rajdhani font-bold text-white mb-4">
                        Engineering <span className="text-orange">Excellence</span>
                    </h2>
                    <p className="text-silver/60 max-w-2xl mx-auto font-source text-lg leading-relaxed">
                        High-performance industrial equipment designed for maximum efficiency and durability. 
                        Manufactured with precision at our Namakkal facility.
                    </p>
                </motion.div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-96 bg-silver/5 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {visibleProducts.map(p => (
                            <ProductCard key={p._id} product={p} onBuyNow={handleBuyNow} />
                        ))}
                    </div>
                )}

                {!loading && visibleCount < products.length && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={() => setVisibleCount(c => c + 4)}
                            className="font-rajdhani font-bold text-orange uppercase tracking-widest border border-orange/20 px-10 py-4 rounded-xl hover:bg-orange/5 transition-all text-sm flex items-center gap-2 mx-auto active:scale-95"
                        >
                            View Entire Catalog <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
