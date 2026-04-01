import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Mail, Phone, Send, Loader2 } from 'lucide-react';
import { COMPANY } from '../data/siteData';

const SERVICE_OPTIONS = [
    'Agro & Poultry Machinery',
    'Food Processing Machines',
    'Material Fabrication & Engineering Works',
    'Pre-Engineered Buildings (PEB)',
    '3D Printing & Reverse Engineering',
    'EV Design & Development',
    'Other / General Inquiry',
];

const INITIAL_FORM = { name: '', email: '', company: '', service: '', message: '' };

export default function Contact() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | loading | success | error
    const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

    const validate = () => {
        const errs = {};
        if (!form.name.trim()) errs.name = 'Name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email address';
        if (!form.service) errs.service = 'Please select a service';
        if (!form.message.trim()) errs.message = 'Message is required';
        else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters';
        return errs;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length > 0) { setErrors(errs); return; }

        setStatus('loading');
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                setStatus('success');
                setForm(INITIAL_FORM);
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    const inputClass = (field) =>
        `w-full bg-[rgba(30,58,95,0.2)] border rounded-lg px-4 py-3 font-source text-offwhite text-sm placeholder-silver/40 transition-all duration-300 outline-none focus:border-orange focus:bg-[rgba(30,58,95,0.35)] focus:shadow-orange-glow ${errors[field] ? 'border-red-500/70' : 'border-silver/20'
        }`;

    return (
        <section id="contact" className="relative py-24 overflow-hidden" aria-labelledby="contact-title">
            <div
                className="absolute inset-0 blueprint-bg"
                style={{ backgroundSize: '40px 40px', opacity: 0.25 }}
                aria-hidden="true"
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, #0f1117 0%, rgba(10,15,24,0.95) 50%, #0f1117 100%)' }}
                aria-hidden="true"
            />

            <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="h-px w-12 bg-orange" />
                        <span className="font-rajdhani text-orange uppercase tracking-widest text-sm font-semibold">Get In Touch</span>
                        <div className="h-px w-12 bg-orange" />
                    </div>
                    <h2 id="contact-title" className="section-title mb-4">
                        Contact <span className="text-orange">Us</span>
                    </h2>
                    <p className="section-subtitle max-w-2xl mx-auto">
                        Ready to start your project? Reach out to us for a consultation and quote
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="glass-card p-8"
                    >
                        <h3 className="font-rajdhani font-bold text-2xl text-offwhite mb-6">
                            Send a <span className="text-orange">Message</span>
                        </h3>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-12 text-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                                    <Send size={28} color="#22c55e" />
                                </div>
                                <h4 className="font-rajdhani font-bold text-xl text-offwhite">Message Sent!</h4>
                                <p className="font-source text-silver/70 text-sm max-w-xs">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    aria-label="Send another message"
                                    className="text-orange font-rajdhani font-semibold text-sm hover:underline mt-2"
                                >
                                    Send Another Message
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="contact-name" className="block font-rajdhani font-semibold text-silver/80 text-xs uppercase tracking-wider mb-1.5">
                                            Full Name *
                                        </label>
                                        <input
                                            id="contact-name"
                                            name="name"
                                            type="text"
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            className={inputClass('name')}
                                            aria-required="true"
                                            aria-invalid={!!errors.name}
                                            aria-describedby={errors.name ? 'name-error' : undefined}
                                        />
                                        {errors.name && <p id="name-error" className="text-red-400 text-xs mt-1" role="alert">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="contact-email" className="block font-rajdhani font-semibold text-silver/80 text-xs uppercase tracking-wider mb-1.5">
                                            Email *
                                        </label>
                                        <input
                                            id="contact-email"
                                            name="email"
                                            type="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="your@email.com"
                                            className={inputClass('email')}
                                            aria-required="true"
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? 'email-error' : undefined}
                                        />
                                        {errors.email && <p id="email-error" className="text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="contact-company" className="block font-rajdhani font-semibold text-silver/80 text-xs uppercase tracking-wider mb-1.5">
                                        Company Name
                                    </label>
                                    <input
                                        id="contact-company"
                                        name="company"
                                        type="text"
                                        value={form.company}
                                        onChange={handleChange}
                                        placeholder="Your company"
                                        className={inputClass('company')}
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="contact-service" className="block font-rajdhani font-semibold text-silver/80 text-xs uppercase tracking-wider mb-1.5">
                                        Service Required *
                                    </label>
                                    <select
                                        id="contact-service"
                                        name="service"
                                        value={form.service}
                                        onChange={handleChange}
                                        className={inputClass('service') + ' cursor-pointer'}
                                        aria-required="true"
                                        aria-invalid={!!errors.service}
                                        aria-describedby={errors.service ? 'service-error' : undefined}
                                    >
                                        <option value="" disabled>Select a service...</option>
                                        {SERVICE_OPTIONS.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                    {errors.service && <p id="service-error" className="text-red-400 text-xs mt-1" role="alert">{errors.service}</p>}
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="contact-message" className="block font-rajdhani font-semibold text-silver/80 text-xs uppercase tracking-wider mb-1.5">
                                        Message *
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        name="message"
                                        rows={5}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Describe your project requirements..."
                                        className={inputClass('message') + ' resize-none'}
                                        aria-required="true"
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? 'message-error' : undefined}
                                    />
                                    {errors.message && <p id="message-error" className="text-red-400 text-xs mt-1" role="alert">{errors.message}</p>}
                                </div>

                                {status === 'error' && (
                                    <p className="text-red-400 text-sm mb-4 font-source" role="alert">
                                        Something went wrong. Please try again or contact us directly via email.
                                    </p>
                                )}

                                <motion.button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    whileHover={status !== 'loading' ? { scale: 1.03 } : {}}
                                    whileTap={status !== 'loading' ? { scale: 0.97 } : {}}
                                    aria-label="Send inquiry message"
                                    className="ripple-effect w-full flex items-center justify-center gap-3 bg-orange text-white font-rajdhani font-bold py-3.5 rounded-lg text-base uppercase tracking-wider hover:shadow-orange-glow transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {status === 'loading' ? (
                                        <><Loader2 size={18} className="animate-spin" /> Sending...</>
                                    ) : (
                                        <><Send size={18} /> Send Message</>
                                    )}
                                </motion.button>
                            </form>
                        )}
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="flex flex-col gap-6"
                    >
                        {/* Info Cards */}
                        {[
                            {
                                icon: MapPin,
                                title: 'Our Address',
                                content: COMPANY.address,
                                sub: 'Units: Athanoor & Vaiyappamalai, Namakkal',
                            },
                            {
                                icon: Mail,
                                title: 'Email Us',
                                content: COMPANY.email,
                                sub: 'We respond within 24 hours',
                            },
                            {
                                icon: Phone,
                                title: 'Call Us',
                                content: COMPANY.phone,
                                sub: 'Mon–Sat, 9AM – 6PM IST',
                            },
                        ].map(({ icon: Icon, title, content, sub }) => (
                            <motion.div
                                key={title}
                                whileHover={{ x: 6 }}
                                className="glass-card p-6 flex items-start gap-4 transition-all duration-300 hover:border-orange/30"
                            >
                                <div className="w-12 h-12 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center flex-shrink-0">
                                    <Icon size={20} color="#ff6b2b" />
                                </div>
                                <div>
                                    <div className="font-rajdhani font-bold text-offwhite mb-1">{title}</div>
                                    <div className="font-source text-silver text-sm">{content}</div>
                                    <div className="font-source text-silver/50 text-xs mt-0.5">{sub}</div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Blueprint Map Placeholder */}
                        <div
                            className="glass-card flex-1 min-h-[160px] flex items-center justify-center relative overflow-hidden"
                            aria-label="Company location map placeholder"
                        >
                            <div className="absolute inset-0 blueprint-bg opacity-50" style={{ backgroundSize: '20px 20px' }} aria-hidden="true" />
                            <div className="relative z-10 text-center">
                                <MapPin size={32} color="rgba(255,107,43,0.6)" className="mx-auto mb-2" aria-hidden="true" />
                                <p className="font-rajdhani font-semibold text-silver/60 text-sm">Fairlands, Salem</p>
                                <p className="font-source text-silver/40 text-xs">Tamil Nadu – 636004</p>
                                <a
                                    href="https://maps.google.com/?q=OM+Shiva+Towers,Advaitha+Ashram+Road,Fairlands,Salem"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="View location on Google Maps"
                                    className="mt-3 inline-block text-orange font-rajdhani font-semibold text-sm hover:underline"
                                >
                                    View on Google Maps →
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
