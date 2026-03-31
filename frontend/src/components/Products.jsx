import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Tag, Star, ChevronRight, ShoppingBag, Layers, ArrowRight } from 'lucide-react';
import { apiFetch, getImageUrl } from '../utils/api';
import ProductBanner from './ProductBanner';

const TAG_COLORS = {
    NEW: { bg: 'rgba(34,197,94,0.2)', color: '#22c55e', border: 'rgba(34,197,94,0.4)' },
    HOT: { bg: 'rgba(239,68,68,0.2)', color: '#ef4444', border: 'rgba(239,68,68,0.4)' },
    LIMITED: { bg: 'rgba(251,191,36,0.2)', color: '#fbbf24', border: 'rgba(251,191,36,0.4)' },
};

const CAT_COLORS = {
    Civil: '#3b82f6',
    Mechanical: '#f59e0b',
    'Eco Products': '#22c55e',
};

function ProductCard({ product, index, onBuyNow }) {
    const [hovered, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const imgSrc = getImageUrl(product.image);
    const tagStyle = TAG_COLORS[product.tag] || null;
    const catColor = CAT_COLORS[product.category] || '#ff6b2b';

    return (
        <motion.article
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.07 }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 16,
                overflow: 'hidden',
                background: product.isFeatured
                    ? 'linear-gradient(145deg, rgba(30,58,95,0.5), rgba(20,30,50,0.8))'
                    : 'rgba(20,30,48,0.7)',
                border: product.isFeatured
                    ? '1.5px solid rgba(251,191,36,0.5)'
                    : `1px solid ${hovered ? 'rgba(255,107,43,0.4)' : 'rgba(192,200,216,0.1)'}`,
                boxShadow: product.isFeatured
                    ? (hovered ? '0 0 32px rgba(251,191,36,0.35), 0 8px 40px rgba(0,0,0,0.4)' : '0 0 20px rgba(251,191,36,0.2), 0 4px 20px rgba(0,0,0,0.3)')
                    : (hovered ? '0 8px 40px rgba(255,107,43,0.15)' : '0 4px 20px rgba(0,0,0,0.3)'),
                backdropFilter: 'blur(14px)',
                transition: 'all 0.3s ease',
                transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
            }}
            aria-label={`Product: ${product.name}`}
        >
            {/* Featured glow bar */}
            {product.isFeatured && (
                <div aria-hidden="true" style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                    background: 'linear-gradient(90deg, transparent, #fbbf24, #f59e0b, #fbbf24, transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer-gold 2s linear infinite',
                }} />
            )}

            {/* Image */}
            <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: 'rgba(10,15,30,0.8)', flexShrink: 0 }}>
                {imgSrc && !imgError ? (
                    <img
                        src={imgSrc}
                        alt={product.name}
                        onError={() => setImgError(true)}
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            transition: 'transform 0.4s ease',
                            transform: hovered ? 'scale(1.08)' : 'scale(1)',
                        }}
                        loading="lazy"
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,30,50,0.9)' }}>
                        <ShoppingBag size={48} style={{ color: 'rgba(192,200,216,0.2)' }} />
                    </div>
                )}
                {/* Tag badge */}
                {product.tag && tagStyle && (
                    <div style={{
                        position: 'absolute', top: 10, left: 10,
                        background: tagStyle.bg, color: tagStyle.color,
                        border: `1px solid ${tagStyle.border}`,
                        padding: '3px 10px', borderRadius: 100,
                        fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                        fontFamily: 'Rajdhani, sans-serif',
                    }}>
                        {product.tag}
                    </div>
                )}
                {/* Featured badge */}
                {product.isFeatured && (
                    <div style={{
                        position: 'absolute', top: 10, right: 10,
                        background: 'rgba(251,191,36,0.2)', color: '#fbbf24',
                        border: '1px solid rgba(251,191,36,0.5)',
                        padding: '3px 10px', borderRadius: 100,
                        fontSize: 11, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontFamily: 'Rajdhani, sans-serif',
                    }}>
                        <Star size={10} fill="#fbbf24" /> FEATURED
                    </div>
                )}
                {/* Stock warning */}
                {product.stock !== undefined && product.stock <= 10 && product.stock > 0 && (
                    <div style={{
                        position: 'absolute', bottom: 8, right: 8,
                        background: 'rgba(239,68,68,0.9)', color: '#fff',
                        padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700,
                    }}>
                        Only {product.stock} left!
                    </div>
                )}
                {product.stock === 0 && (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <span style={{ color: '#ef4444', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 20, letterSpacing: 2 }}>OUT OF STOCK</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', flex: 1, gap: 8 }}>
                {/* Category */}
                <span style={{
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: catColor,
                    fontFamily: 'Rajdhani, sans-serif',
                    display: 'flex', alignItems: 'center', gap: 4,
                }}>
                    <Layers size={11} /> {product.category}
                </span>

                {/* Name */}
                <h3 style={{
                    fontFamily: 'Rajdhani, sans-serif',
                    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                    fontWeight: 700, color: '#f4f6f9',
                    lineHeight: 1.25, margin: 0,
                }}>
                    {product.name}
                </h3>

                {/* Description */}
                <p style={{
                    color: 'rgba(192,200,216,0.75)',
                    fontSize: 13, lineHeight: 1.65,
                    flex: 1,
                    display: '-webkit-box', WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    fontFamily: 'Source Sans 3, sans-serif',
                }}>
                    {product.description}
                </p>

                {/* Price */}
                {product.price > 0 && (
                    <p style={{ color: '#ff6b2b', fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 18, margin: 0 }}>
                        ₹{product.price.toLocaleString('en-IN')}
                    </p>
                )}

                {/* Buy Now button */}
                <button
                    onClick={() => onBuyNow(product)}
                    disabled={product.stock === 0}
                    style={{
                        marginTop: 8,
                        padding: '10px 16px',
                        borderRadius: 8,
                        border: 'none',
                        background: product.stock === 0 ? 'rgba(192,200,216,0.15)' : (product.isFeatured ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'linear-gradient(135deg,#ff6b2b,#e84a0a)'),
                        color: product.stock === 0 ? 'rgba(192,200,216,0.4)' : '#fff',
                        fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                        fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
                        cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        transition: 'all 0.2s',
                        boxShadow: product.stock === 0 ? 'none' : (product.isFeatured ? '0 4px 16px rgba(245,158,11,0.35)' : '0 4px 16px rgba(255,107,43,0.35)'),
                        width: '100%',
                    }}
                    aria-label={`Buy ${product.name}`}
                >
                    <ShoppingBag size={15} />
                    {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
                </button>
            </div>
        </motion.article>
    );
}

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(4);
    const [ref, inView] = useInView({ threshold: 0.05, triggerOnce: true });
    const navigate = useNavigate();

    useEffect(() => {
        apiFetch('/products')
            .then(d => setProducts(d.products || []))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false));
    }, []);

    function handleBuyNow(product) {
        const token = localStorage.getItem('sritech_token');
        if (!token) {
            navigate('/?view=auth&redirect=' + encodeURIComponent('/?view=shop') + '&product=' + product._id);
            return;
        }
        navigate('/?view=shop&product=' + product._id);
    }

    const visibleProducts = products.slice(0, visibleCount);
    const hasMore = visibleCount < products.length;

    return (
        <>
            {/* Dynamic Banner above products */}
            <ProductBanner />

            <section id="products" className="relative py-20 md:py-28 overflow-hidden" aria-labelledby="products-title">
                <style>{`
                    @keyframes shimmer-gold {
                        0% { background-position: 0% 0; }
                        100% { background-position: 200% 0; }
                    }
                    @keyframes fade-card {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>

                {/* Bg */}
                <div className="absolute inset-0 blueprint-bg" style={{ opacity: 0.2 }} aria-hidden="true" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(8,12,20,0.97) 50%, #0f1117 100%)' }} aria-hidden="true" />

                <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-14"
                    >
                        {/* Featured highlight */}
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(251,191,36,0.12)',
                            border: '1px solid rgba(251,191,36,0.3)',
                            padding: '6px 20px', borderRadius: 50,
                            marginBottom: 20,
                        }}>
                            <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                            <span style={{ color: '#fbbf24', fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                🔥 Featured Engineering Products
                            </span>
                            <Star size={14} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="h-px w-10" style={{ background: '#ff6b2b' }} />
                            <span className="font-rajdhani font-semibold text-sm uppercase tracking-widest" style={{ color: '#ff6b2b' }}>
                                What We Offer
                            </span>
                            <div className="h-px w-10" style={{ background: '#ff6b2b' }} />
                        </div>

                        <h2 id="products-title" className="section-title mb-3">
                            Our <span style={{ color: '#ff6b2b' }}>Products</span>
                        </h2>
                        <p className="section-subtitle max-w-2xl mx-auto">
                            Innovative Civil &amp; Sustainable Solutions — engineered for quality, built for performance
                        </p>
                    </motion.div>

                    {/* Loading skeleton */}
                    {loading && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20 }}>
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} style={{ height: 380, borderRadius: 16, background: 'rgba(20,30,48,0.5)', border: '1px solid rgba(192,200,216,0.08)', animation: 'pulse 1.5s ease-in-out infinite' }} />
                            ))}
                        </div>
                    )}

                    {/* Empty state */}
                    {!loading && products.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <ShoppingBag size={64} style={{ color: 'rgba(192,200,216,0.2)', margin: '0 auto 16px' }} />
                            <p style={{ color: 'rgba(192,200,216,0.5)', fontFamily: 'Rajdhani, sans-serif', fontSize: 18 }}>
                                Products coming soon. Check back later!
                            </p>
                        </div>
                    )}

                    {/* Product grid */}
                    {!loading && products.length > 0 && (
                        <>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                                gap: 20,
                            }}>
                                {visibleProducts.map((product, i) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        index={i}
                                        onBuyNow={handleBuyNow}
                                    />
                                ))}
                            </div>

                            {/* Load More / View All */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ delay: 0.4 }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 36, flexWrap: 'wrap' }}
                            >
                                {hasMore && (
                                    <button
                                        onClick={() => setVisibleCount(c => c + 4)}
                                        style={{
                                            padding: '12px 28px',
                                            borderRadius: 8,
                                            border: '1.5px solid rgba(255,107,43,0.5)',
                                            background: 'rgba(255,107,43,0.1)',
                                            color: '#ff6b2b',
                                            fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                                            fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
                                            cursor: 'pointer', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: 6,
                                        }}
                                        aria-label="Load more products"
                                    >
                                        Load More ({products.length - visibleCount} remaining)
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate('/?view=shop')}
                                    style={{
                                        padding: '12px 28px',
                                        borderRadius: 8,
                                        border: 'none',
                                        background: 'linear-gradient(135deg,#ff6b2b,#e84a0a)',
                                        color: '#fff',
                                        fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                                        fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: 6,
                                        boxShadow: '0 4px 20px rgba(255,107,43,0.35)',
                                    }}
                                    aria-label="View all products in full shop"
                                >
                                    View All Products <ArrowRight size={16} />
                                </button>
                            </motion.div>

                            <p style={{ textAlign: 'center', color: 'rgba(192,200,216,0.4)', fontSize: 12, marginTop: 16, fontFamily: 'Source Sans 3, sans-serif' }}>
                                Showing {Math.min(visibleCount, products.length)} of {products.length} products
                            </p>
                        </>
                    )}
                </div>
            </section>
        </>
    );
}
