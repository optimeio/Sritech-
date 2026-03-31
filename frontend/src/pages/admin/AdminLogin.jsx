import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import SEO from '../../components/SEO';

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await apiFetch('/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify(credentials),
            });

            if (res.error) throw new Error(res.error);

            localStorage.setItem('sritech_token', res.token);
            window.location.href = '/admin';
        } catch (err) {
            setError(err.message || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-charcoal flex items-center justify-center p-4 relative overflow-hidden text-offwhite font-source">
            <SEO title="Admin Login" description="Secure admin access for Sri Tech Engineering." />
            
            {/* Background elements */}
            <div className="absolute inset-0 blueprint-bg opacity-30 pointer-events-none" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange rounded-full mix-blend-multiply filter blur-3xl opacity-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-steel rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-steel/30 border border-steel/50 mb-4"
                    >
                        <Lock size={32} className="text-orange" />
                    </motion.div>
                    <h1 className="font-rajdhani text-3xl md:text-4xl font-bold mb-2 tracking-wide text-offwhite drop-shadow-md">
                        SRI TECH <span className="text-orange">ADMIN</span>
                    </h1>
                    <p className="text-silver/80 text-sm tracking-widest uppercase">
                        Restricted Access System
                    </p>
                </div>

                {/* Login Card */}
                <form
                    onSubmit={handleSubmit}
                    className="glass-card p-6 md:p-8 flex flex-col gap-6"
                >
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-center gap-3 text-red-500 text-sm overflow-hidden"
                            >
                                <AlertCircle size={18} className="flex-shrink-0" />
                                <p>{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-4">
                        <div className="relative">
                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    value={credentials.email}
                                    onChange={e => setCredentials({ ...credentials, email: e.target.value })}
                                    className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 text-offwhite focus:border-orange focus:ring-1 focus:ring-orange outline-none transition-all placeholder:text-silver/30"
                                    placeholder="admin@sritech.in"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label className="block text-xs font-semibold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange transition-colors" size={20} />
                                <input
                                    type="password"
                                    required
                                    autoComplete="current-password"
                                    value={credentials.password}
                                    onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                                    className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 text-offwhite focus:border-orange focus:ring-1 focus:ring-orange outline-none transition-all placeholder:text-silver/30"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange hover:bg-orange/90 active:scale-[0.98] text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-orange-glow disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Authenticate <ArrowRight size={20} />
                            </>
                        )}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="text-center text-xs text-silver/60 hover:text-orange transition-colors mt-2"
                    >
                        ← Back to Public Site
                    </button>
                </form>
            </motion.div>
        </main>
    );
}
