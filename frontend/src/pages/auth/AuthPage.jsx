import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, Lock, Mail, Phone, ArrowRight, ShieldCheck, MailCheck } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import SEO from '../../components/SEO';

export default function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const redirect = searchParams.get('redirect') || '/';
    const productParam = searchParams.get('product') || '';
    
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1 = form, 2 = otp, 3 = forgot pwd, 4 = reset pwd
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', otp: '' });

    // Login Submission
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            if (res.error) throw new Error(res.error);
            localStorage.setItem('sritech_token', res.token);
            const queryChar = redirect.includes('?') ? '&' : '?';
            navigate(redirect + (productParam ? `${queryChar}product=${productParam}` : ''));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Register Submission
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
            });
            if (res.error) throw new Error(res.error);
            setSuccess(res.message);
            setStep(2); // Go to OTP verification
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Forgot Password
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify({ email: form.email }),
            });
            if (res.error) throw new Error(res.error);
            setSuccess(res.message);
            setStep(4); // Go to Reset Password (OTP + New Password)
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify({ email: form.email, otp: form.otp, newPassword: form.password }),
            });
            if (res.error) throw new Error(res.error);
            setSuccess(res.message);
            setStep(1); // Go back to login
            setIsLogin(true);
            setForm({ ...form, password: '', otp: '' });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await apiFetch('/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'no-auth': 'true' },
                body: JSON.stringify({ email: form.email, otp: form.otp }),
            });
            if (res.error) throw new Error(res.error);
            localStorage.setItem('sritech_token', res.token);
            setSuccess('Email verified successfully!');
            setTimeout(() => {
                navigate(redirect + (productParam ? `?product=${productParam}` : ''));
            }, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-charcoal flex items-center justify-center p-4 relative overflow-hidden font-source text-offwhite">
            <SEO title={isLogin ? 'Sign In | Sri Tech Engineering' : 'Create Account | Sri Tech Engineering'} />
            
            {/* Blueprint background */}
            <div className="absolute inset-0 blueprint-bg opacity-20 pointer-events-none" />

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10 glass-card">
                
                <div className="p-8 pb-6 border-b border-white/5 bg-white/5 rounded-t-xl text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange/10 border border-orange/20 mb-3">
                        {step === 2 ? <MailCheck className="text-orange" size={28} /> : <ShieldCheck className="text-orange" size={28} />}
                    </div>
                    <h1 className="font-rajdhani text-2xl md:text-3xl font-bold tracking-wide">
                        {step === 4 ? 'RESET PASSWORD' : step === 3 ? 'FORGOT PASSWORD' : (step === 2 ? 'VERIFY EMAIL' : (isLogin ? 'WELCOME BACK' : 'CREATE ACCOUNT'))}
                    </h1>
                    <p className="text-silver/60 text-sm mt-1">
                        {step === 4 ? `OTP sent to ${form.email}` : step === 3 ? 'Enter your email to receive an OTP' : (step === 2 ? `OTP sent to ${form.email}` : (isLogin ? 'Sign in to place orders' : 'Join Sri Tech Engineering'))}
                    </p>
                </div>

                <div className="p-8 pt-6">
                    <AnimatePresence>
                        {error && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg p-3 text-sm flex gap-2 mb-4">
                                <span className="font-bold">Error:</span> {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg p-3 text-sm flex gap-2 mb-4">
                                <span className="font-bold">Success:</span> {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {step === 1 && (
                        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                        <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="John Doe" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="john@example.com" />
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Phone Number (Optional)</label>
                                    <div className="relative group">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                        <input type="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="+91 XXXXX XXXXX" />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                    <input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="••••••••" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-orange text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl shadow-orange-glow mt-4 flex justify-center items-center gap-2">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')} <ArrowRight size={18} />
                            </button>

                            {isLogin && (
                                <div className="text-right mt-1">
                                    <button type="button" onClick={() => { setStep(3); setError(''); setSuccess(''); }} className="text-xs text-orange hover:text-orange/80 transition-colors">
                                        Forgot Password?
                                    </button>
                                </div>
                            )}

                            <div className="text-center mt-6">
                                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} className="text-sm text-silver/60 hover:text-orange transition-colors">
                                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleForgotPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                    <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="john@example.com" />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-orange text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl shadow-orange-glow mt-4 flex justify-center items-center">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset OTP'}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setStep(1); setError(''); setSuccess(''); }} className="text-xs text-silver/50 hover:text-offwhite">Back to login</button>
                            </div>
                        </form>
                    )}

                    {step === 4 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1 text-center">Enter 6-Digit OTP</label>
                                <input type="text" required maxLength="6" value={form.otp} onChange={e => setForm({...form, otp: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-4 px-4 focus:border-orange outline-none text-center font-rajdhani text-3xl tracking-[0.5em] text-orange font-bold placeholder:text-silver/20" placeholder="000000" />
                            </div>
                            
                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-silver/40 group-focus-within:text-orange" size={18} />
                                    <input type="password" required minLength="6" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-3 pl-10 pr-4 focus:border-orange outline-none" placeholder="••••••••" />
                                </div>
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-orange text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl shadow-orange-glow mt-4 flex justify-center items-center">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => { setStep(1); setError(''); setSuccess(''); }} className="text-xs text-silver/50 hover:text-offwhite">Cancel reset</button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-silver/70 uppercase tracking-widest mb-1.5 ml-1 text-center">Enter 6-Digit OTP</label>
                                <input type="text" required maxLength="6" value={form.otp} onChange={e => setForm({...form, otp: e.target.value})} className="w-full bg-charcoal/50 border border-silver/10 rounded-xl py-4 px-4 focus:border-orange outline-none text-center font-rajdhani text-3xl tracking-[0.5em] text-orange font-bold placeholder:text-silver/20" placeholder="000000" />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-orange text-white font-rajdhani font-bold text-lg tracking-widest uppercase py-3.5 rounded-xl shadow-orange-glow mt-4 flex justify-center items-center">
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Verify Email & Continue'}
                            </button>
                            <div className="text-center mt-4">
                                <button type="button" onClick={() => setStep(1)} className="text-xs text-silver/50 hover:text-offwhite">Cancel registration</button>
                            </div>
                        </form>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
