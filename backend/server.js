import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Ensure uploads dir exists ───────────────────────────────────────────────
const uploadsDir = join(__dirname, 'uploads');
try { mkdirSync(uploadsDir, { recursive: true }); } catch {}

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/uploads', express.static(uploadsDir));

// ─── MongoDB Models ──────────────────────────────────────────────────────────
const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['Civil', 'Mechanical', 'Eco Products'] },
    image: { type: String, default: '' },
    isFeatured: { type: Boolean, default: false },
    tag: { type: String, enum: ['NEW', 'HOT', 'LIMITED', ''], default: '' },
    stock: { type: Number, default: 100, min: 0 },
    price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
});

const bannerSchema = new mongoose.Schema({
    title: { type: String, default: '🔥 Mega Offer on Civil Products' },
    subtitle: { type: String, default: 'High Quality Engineering Solutions for Modern Construction' },
    buttonText: { type: String, default: 'Enquire Now' },
    buttonLink: { type: String, default: 'https://wa.me/919043340278' },
    tag: { type: String, default: 'Limited Offer' },
    isActive: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    user: { name: String, email: String, phone: String, address: String },
    product: { id: String, name: String, category: String, price: Number, image: String },
    quantity: { type: Number, default: 1 },
    totalAmount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    notes: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);
const Banner = mongoose.model('Banner', bannerSchema);
const User = mongoose.model('User', userSchema);
const Order = mongoose.model('Order', orderSchema);

// ─── In-memory OTP store ─────────────────────────────────────────────────────
const otpStore = new Map(); // email -> { otp, expiry }

// ─── MongoDB Connect ─────────────────────────────────────────────────────────
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected – Sritech database');
        // Seed default banner if none exists
        const count = await Banner.countDocuments();
        if (count === 0) {
            await Banner.create({
                title: '🔥 Mega Offer on Civil Products',
                subtitle: 'High Quality Engineering Solutions for Modern Construction',
                buttonText: 'Enquire Now',
                buttonLink: `https://wa.me/91${process.env.WHATSAPP_NUMBER}`,
                tag: 'Limited Offer',
                isActive: true,
            });
            console.log('✅ Default banner seeded');
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
    }
}
connectDB();

// ─── Multer (disk storage) ───────────────────────────────────────────────────
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`);
    },
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) return cb(new Error('Only image files allowed'));
        cb(null, true);
    },
});

// ─── Nodemailer ──────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});
transporter.verify(err => {
    if (err) console.error('❌ Mail transporter error:', err.message);
    else console.log('✅ Mail transporter ready');
});

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function adminAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        req.admin = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

function userAuth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

// ─── Helper: generate OTP ────────────────────────────────────────────────────
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// ─── Generate unique orderId ─────────────────────────────────────────────────
function generateOrderId() {
    return 'SRT' + Date.now().toString().slice(-8) + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// ══════════════════════════════════════════════════════════════════════════════
//   ADMIN AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    if (email.trim().toLowerCase() !== process.env.ADMIN_EMAIL.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ role: 'admin', email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log(`✅ Admin logged in: ${email}`);
    return res.json({ success: true, token, email });
});

// ══════════════════════════════════════════════════════════════════════════════
//   CUSTOMER AUTH ROUTES
// ══════════════════════════════════════════════════════════════════════════════

// Register + send OTP
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim()) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ error: 'Invalid email' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    try {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing && existing.isVerified) return res.status(409).json({ error: 'Email already registered' });
        const hashed = await bcrypt.hash(password, 10);
        if (existing && !existing.isVerified) {
            // Update unverified user
            existing.name = name.trim();
            existing.password = hashed;
            existing.phone = phone || '';
            await existing.save();
        } else {
            await User.create({ name: name.trim(), email: email.toLowerCase(), password: hashed, phone: phone || '' });
        }
        // Generate + store OTP
        const otp = generateOTP();
        otpStore.set(email.toLowerCase(), { otp, expiry: Date.now() + 10 * 60 * 1000 }); // 10 min expiry
        // Send OTP email
        await transporter.sendMail({
            from: `"Sri Tech Engineering" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Your OTP – Sri Tech Engineering',
            html: otpEmailTemplate(name, otp),
        });
        console.log(`📧 OTP sent to ${email}: ${otp}`);
        return res.json({ success: true, message: 'OTP sent to your email' });
    } catch (err) {
        console.error('Register error:', err.message);
        return res.status(500).json({ error: 'Registration failed. Try again.' });
    }
});

// Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
    const record = otpStore.get(email.toLowerCase());
    if (!record) return res.status(400).json({ error: 'OTP not found. Please register again.' });
    if (Date.now() > record.expiry) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ error: 'OTP expired. Please register again.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ error: 'Invalid OTP' });
    try {
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { isVerified: true },
            { new: true }
        );
        otpStore.delete(email.toLowerCase());
        const token = jwt.sign({ role: 'user', userId: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
        // Notify admin of new user
        try {
            await transporter.sendMail({
                from: `"Sri Tech Website" <${process.env.GMAIL_USER}>`,
                to: process.env.OWNER_EMAIL,
                subject: `👤 New Customer Registered – ${user.name}`,
                html: newUserAdminTemplate(user),
            });
        } catch {}
        return res.json({ success: true, token, user: { name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        return res.status(500).json({ error: 'Verification failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });
        if (!user.isVerified) return res.status(403).json({ error: 'Email not verified. Please verify your account.' });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid email or password' });
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign({ role: 'user', userId: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.log(`✅ User logged in: ${email}`);
        // Notify admin of login
        try {
            await transporter.sendMail({
                from: `"Sri Tech Website" <${process.env.GMAIL_USER}>`,
                to: process.env.OWNER_EMAIL,
                subject: `🔑 Customer Login – ${user.name}`,
                html: userLoginAdminTemplate(user),
            });
        } catch {}
        return res.json({ success: true, token, user: { name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        return res.status(500).json({ error: 'Login failed' });
    }
});

// Forgot Password - Send OTP
app.post('/api/auth/forgot-password', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ error: 'User with this email not found' });
        
        const otp = generateOTP();
        otpStore.set(email.toLowerCase(), { otp, expiry: Date.now() + 10 * 60 * 1000 });
        
        await transporter.sendMail({
            from: `"Sri Tech Engineering" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: 'Password Reset OTP – Sri Tech Engineering',
            html: otpEmailTemplate(user.name, otp, 'We received a request to reset your password. Use the OTP below to set a new password. This code expires in <strong style="color:#ff6b2b;">10 minutes</strong>.'),
        });
        
        return res.json({ success: true, message: 'Password reset OTP sent to your email' });
    } catch (err) {
        console.error('Forgot password error:', err.message);
        return res.status(500).json({ error: 'Failed to send reset OTP' });
    }
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ error: 'All fields are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    
    const record = otpStore.get(email.toLowerCase());
    if (!record) return res.status(400).json({ error: 'OTP request not found or expired' });
    if (Date.now() > record.expiry) {
        otpStore.delete(email.toLowerCase());
        return res.status(400).json({ error: 'OTP expired. Please request again.' });
    }
    if (record.otp !== otp.trim()) return res.status(400).json({ error: 'Invalid OTP' });
    
    try {
        const hashed = await bcrypt.hash(newPassword, 10);
        await User.findOneAndUpdate({ email: email.toLowerCase() }, { password: hashed });
        otpStore.delete(email.toLowerCase());
        
        return res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
    } catch (err) {
        console.error('Reset password error:', err.message);
        return res.status(500).json({ error: 'Failed to reset password' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   PRODUCTS ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/products', async (_req, res) => {
    try {
        const products = await Product.find().sort({ isFeatured: -1, createdAt: -1 });
        return res.json({ success: true, products });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.post('/api/products', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, isFeatured, tag, stock, price } = req.body;
        if (!name?.trim() || !description?.trim() || !category) {
            return res.status(400).json({ error: 'Name, description and category are required' });
        }
        const imageUrl = req.file ? `/api/uploads/${req.file.filename}` : '';
        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            category,
            image: imageUrl,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            tag: tag || '',
            stock: parseInt(stock) || 100,
            price: parseFloat(price) || 0,
        });
        return res.status(201).json({ success: true, product });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to create product: ' + err.message });
    }
});

app.put('/api/products/:id', adminAuth, upload.single('image'), async (req, res) => {
    try {
        const { name, description, category, isFeatured, tag, stock, price } = req.body;
        const update = {};
        if (name) update.name = name.trim();
        if (description) update.description = description.trim();
        if (category) update.category = category;
        if (isFeatured !== undefined) update.isFeatured = isFeatured === 'true' || isFeatured === true;
        if (tag !== undefined) update.tag = tag;
        if (stock !== undefined) update.stock = parseInt(stock);
        if (price !== undefined) update.price = parseFloat(price);
        if (req.file) update.image = `/api/uploads/${req.file.filename}`;
        const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.json({ success: true, product });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update product' });
    }
});

app.delete('/api/products/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        return res.json({ success: true, message: 'Product deleted' });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   BANNER ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/banner', async (_req, res) => {
    try {
        let banner = await Banner.findOne();
        if (!banner) banner = await Banner.create({});
        return res.json({ success: true, banner });
    } catch {
        return res.status(500).json({ error: 'Failed to fetch banner' });
    }
});

app.put('/api/banner', adminAuth, async (req, res) => {
    try {
        const { title, subtitle, buttonText, buttonLink, tag, isActive } = req.body;
        let banner = await Banner.findOne();
        if (!banner) banner = new Banner();
        if (title !== undefined) banner.title = title;
        if (subtitle !== undefined) banner.subtitle = subtitle;
        if (buttonText !== undefined) banner.buttonText = buttonText;
        if (buttonLink !== undefined) banner.buttonLink = buttonLink;
        if (tag !== undefined) banner.tag = tag;
        if (isActive !== undefined) banner.isActive = isActive;
        banner.updatedAt = new Date();
        await banner.save();
        return res.json({ success: true, banner });
    } catch (err) {
        return res.status(500).json({ error: 'Failed to update banner' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   ORDERS ROUTES
// ══════════════════════════════════════════════════════════════════════════════
app.post('/api/orders', userAuth, async (req, res) => {
    const { productId, quantity, address, notes } = req.body;
    if (!productId || !address?.trim()) {
        return res.status(400).json({ error: 'Product and delivery address are required' });
    }
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        if (product.stock < (quantity || 1)) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }
        const user = await User.findById(req.user.userId);
        const orderId = generateOrderId();
        const qty = parseInt(quantity) || 1;
        const total = product.price * qty;
        const order = await Order.create({
            orderId,
            user: { name: user.name, email: user.email, phone: user.phone, address: address.trim() },
            product: { id: product._id.toString(), name: product.name, category: product.category, price: product.price, image: product.image },
            quantity: qty,
            totalAmount: total,
            notes: notes || '',
        });
        // Deduct stock
        product.stock -= qty;
        await product.save();
        // Email to admin
        try {
            await transporter.sendMail({
                from: `"Sri Tech Website" <${process.env.GMAIL_USER}>`,
                to: process.env.OWNER_EMAIL,
                subject: `🛒 New Order #${orderId} – ${product.name}`,
                html: orderAdminTemplate(order, product),
            });
        } catch (e) { console.error('Admin order email failed:', e.message); }
        // Email to customer
        try {
            await transporter.sendMail({
                from: `"Sri Tech Engineering" <${process.env.GMAIL_USER}>`,
                to: user.email,
                subject: `✅ Order Confirmed – ${orderId} | Sri Tech Engineering`,
                html: orderCustomerTemplate(order, product, user),
            });
        } catch (e) { console.error('Customer order email failed:', e.message); }
        return res.status(201).json({ success: true, order, orderId });
    } catch (err) {
        console.error('Order error:', err.message);
        return res.status(500).json({ error: 'Failed to place order' });
    }
});

app.get('/api/orders', adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch {
        return res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

app.put('/api/orders/:id/status', adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.json({ success: true, order });
    } catch {
        return res.status(500).json({ error: 'Failed to update order' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   USERS ROUTES (admin)
// ══════════════════════════════════════════════════════════════════════════════
app.get('/api/users', adminAuth, async (_req, res) => {
    try {
        const users = await User.find({ isVerified: true }).select('-password').sort({ createdAt: -1 });
        return res.json({ success: true, users });
    } catch {
        return res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   CONTACT FORM (existing)
// ══════════════════════════════════════════════════════════════════════════════
app.post('/api/contact', async (req, res) => {
    const { name, email, company, service, message } = req.body;
    if (!name?.trim() || !email?.trim() || !service?.trim() || !message?.trim()) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) return res.status(400).json({ success: false, error: 'Invalid email address' });
    if (message.trim().length < 10) return res.status(400).json({ success: false, error: 'Message too short' });
    try {
        await transporter.sendMail({
            from: `"Sri Tech Website" <${process.env.GMAIL_USER}>`,
            to: process.env.OWNER_EMAIL,
            subject: `🔔 New Inquiry: ${service} – ${name}`,
            html: ownerEmailTemplate({ name, email, company: company || 'Not provided', service, message }),
            replyTo: email,
        });
        await transporter.sendMail({
            from: `"Sri Tech Engineering" <${process.env.GMAIL_USER}>`,
            to: email,
            subject: `Thank You for Your Inquiry – Sri Tech Engineering`,
            html: clientAutoReplyTemplate({ name, service }),
        });
        return res.status(200).json({ success: true, message: 'Inquiry sent successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Failed to send email. Please try again.' });
    }
});

// ══════════════════════════════════════════════════════════════════════════════
//   EMAIL TEMPLATES
// ══════════════════════════════════════════════════════════════════════════════
function otpEmailTemplate(name, otp, customMessage) {
    const msg = customMessage || 'Use the OTP below to verify your email address. This code expires in <strong style="color:#ff6b2b;">10 minutes</strong>.';
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:520px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;border-bottom:3px solid #ff6b2b;text-align:center;}
.logo{font-size:22px;font-weight:700;color:#f4f6f9;}
.body{background:#111825;padding:36px;}
.otp-box{background:rgba(255,107,43,0.12);border:2px solid rgba(255,107,43,0.4);border-radius:12px;padding:24px;text-align:center;margin:24px 0;}
.otp{font-size:42px;font-weight:700;letter-spacing:12px;color:#ff6b2b;}
.footer{background:#080c12;padding:16px;text-align:center;color:rgba(192,200,216,0.5);font-size:12px;}
</style></head><body>
<div class="container">
<div class="header"><div class="logo">Sri Tech Engineering</div><div style="color:#ff6b2b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Beyond Technology</div></div>
<div class="body">
<h2 style="color:#f4f6f9;font-size:20px;margin-bottom:8px;">Hello, ${name}! 👋</h2>
<p style="color:#c0c8d8;font-size:14px;line-height:1.7;">${msg}</p>
<div class="otp-box"><div class="otp">${otp}</div><p style="color:#c0c8d8;font-size:12px;margin-top:8px;">Your One-Time Password</p></div>
<p style="color:#c0c8d8;font-size:13px;">If you did not request this, please ignore this email.</p>
</div>
<div class="footer">© ${new Date().getFullYear()} Sri Tech Engineering | Do not reply to this email</div>
</div></body></html>`;
}

function newUserAdminTemplate(user) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:520px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;border-bottom:3px solid #22c55e;}
.body{background:#111825;padding:32px;}
.badge{display:inline-block;background:rgba(34,197,94,0.15);color:#22c55e;border:1px solid rgba(34,197,94,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:16px;}
.field{margin-bottom:12px;padding:12px 16px;border:1px solid rgba(30,58,95,0.6);border-radius:8px;}
</style></head><body>
<div class="container">
<div class="header"><div style="font-size:20px;font-weight:700;">Sri Tech Admin Alert</div></div>
<div class="body">
<div class="badge">👤 New User Registered</div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Name</strong><div style="color:#f4f6f9;margin-top:4px;">${user.name}</div></div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Email</strong><div style="color:#f4f6f9;margin-top:4px;">${user.email}</div></div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Phone</strong><div style="color:#f4f6f9;margin-top:4px;">${user.phone || 'Not provided'}</div></div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Registered At</strong><div style="color:#f4f6f9;margin-top:4px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div></div>
</div></div></body></html>`;
}

function userLoginAdminTemplate(user) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:520px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;border-bottom:3px solid #3b82f6;}
.body{background:#111825;padding:32px;}
.badge{display:inline-block;background:rgba(59,130,246,0.15);color:#3b82f6;border:1px solid rgba(59,130,246,0.3);padding:4px 12px;border-radius:100px;font-size:12px;font-weight:600;margin-bottom:16px;}
.field{margin-bottom:12px;padding:12px 16px;border:1px solid rgba(30,58,95,0.6);border-radius:8px;}
</style></head><body>
<div class="container">
<div class="header"><div style="font-size:20px;font-weight:700;">Sri Tech Admin Alert</div></div>
<div class="body">
<div class="badge">🔑 User Login</div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Name</strong><div style="color:#f4f6f9;margin-top:4px;">${user.name}</div></div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Email</strong><div style="color:#f4f6f9;margin-top:4px;">${user.email}</div></div>
<div class="field"><strong style="color:#c0c8d8;font-size:11px;text-transform:uppercase;">Login Time</strong><div style="color:#f4f6f9;margin-top:4px;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div></div>
</div></div></body></html>`;
}

function orderAdminTemplate(order, product) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:600px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;border-bottom:3px solid #ff6b2b;}
.body{background:#111825;padding:32px;}
.badge{display:inline-block;background:rgba(255,107,43,0.15);color:#ff6b2b;border:1px solid rgba(255,107,43,0.3);padding:6px 16px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:20px;}
.field{margin-bottom:12px;padding:12px 16px;border:1px solid rgba(30,58,95,0.6);border-radius:8px;}
.fl{color:#c0c8d8;font-size:11px;text-transform:uppercase;font-weight:600;}
.fv{color:#f4f6f9;margin-top:4px;font-size:15px;}
.wa-btn{display:inline-block;background:#25D366;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin-top:16px;}
</style></head><body>
<div class="container">
<div class="header"><div style="font-size:22px;font-weight:700;">Sri Tech Engineering</div><div style="color:#ff6b2b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">New Order Alert</div></div>
<div class="body">
<div class="badge">🛒 Order #${order.orderId}</div>
<div class="field"><div class="fl">Product</div><div class="fv">${product.name} (${product.category})</div></div>
<div class="field"><div class="fl">Quantity</div><div class="fv">${order.quantity}</div></div>
<div class="field"><div class="fl">Total Amount</div><div class="fv">₹${order.totalAmount || 'Contact for price'}</div></div>
<div class="field"><div class="fl">Customer Name</div><div class="fv">${order.user.name}</div></div>
<div class="field"><div class="fl">Customer Email</div><div class="fv">${order.user.email}</div></div>
<div class="field"><div class="fl">Customer Phone</div><div class="fv">${order.user.phone || 'Not provided'}</div></div>
<div class="field"><div class="fl">Delivery Address</div><div class="fv">${order.user.address}</div></div>
${order.notes ? `<div class="field"><div class="fl">Notes</div><div class="fv">${order.notes}</div></div>` : ''}
<div class="field"><div class="fl">Order Time</div><div class="fv">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div></div>
<a href="https://wa.me/91${process.env.WHATSAPP_NUMBER}?text=Hi, regarding Order ${order.orderId}" class="wa-btn">📱 WhatsApp Customer</a>
</div></div></body></html>`;
}

function orderCustomerTemplate(order, product, user) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:600px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;text-align:center;border-bottom:3px solid #ff6b2b;}
.body{background:#111825;padding:32px;text-align:center;}
.check{width:64px;height:64px;background:rgba(34,197,94,0.15);border:2px solid rgba(34,197,94,0.4);border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;font-size:28px;}
.field{text-align:left;margin-bottom:12px;padding:12px 16px;border:1px solid rgba(30,58,95,0.6);border-radius:8px;}
.fl{color:#c0c8d8;font-size:11px;text-transform:uppercase;font-weight:600;}
.fv{color:#f4f6f9;margin-top:4px;}
.cta{display:inline-block;background:#ff6b2b;color:white;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-top:16px;}
</style></head><body>
<div class="container">
<div class="header"><div style="font-size:22px;font-weight:700;">Sri Tech Engineering</div><div style="color:#ff6b2b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:6px;">Beyond Technology</div></div>
<div class="body">
<div class="check">✓</div>
<h2 style="color:#f4f6f9;font-size:22px;margin-bottom:8px;">Order Confirmed!</h2>
<p style="color:#c0c8d8;font-size:14px;margin-bottom:24px;">Thank you ${user.name}! Your order has been received and our team will contact you shortly.</p>
<div style="display:inline-block;background:rgba(255,107,43,0.15);color:#ff6b2b;border:1px solid rgba(255,107,43,0.3);padding:6px 16px;border-radius:100px;font-size:13px;font-weight:600;margin-bottom:20px;">Order ID: ${order.orderId}</div>
<div class="field"><div class="fl">Product</div><div class="fv">${product.name}</div></div>
<div class="field"><div class="fl">Quantity</div><div class="fv">${order.quantity}</div></div>
<div class="field"><div class="fl">Delivery Address</div><div class="fv">${order.user.address}</div></div>
<div class="field"><div class="fl">Expected Call Within</div><div class="fv">24 Business Hours</div></div>
<a href="https://wa.me/91${process.env.WHATSAPP_NUMBER}?text=Hi Sri Tech, my order ID is ${order.orderId}" class="cta">📱 WhatsApp Us</a>
</div></div></body></html>`;
}

function ownerEmailTemplate({ name, email, company, service, message }) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:600px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:32px;border-bottom:3px solid #ff6b2b;}
.logo-text{font-size:24px;font-weight:700;color:#f4f6f9;}
.tagline{color:#ff6b2b;font-size:12px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;}
.body{background:#111825;padding:32px;}
.alert-title{color:#ff6b2b;font-size:20px;font-weight:700;margin-bottom:20px;}
.field{margin-bottom:16px;border:1px solid rgba(30,58,95,0.6);border-radius:8px;overflow:hidden;}
.field-label{background:rgba(30,58,95,0.5);padding:8px 16px;font-size:11px;color:#c0c8d8;text-transform:uppercase;letter-spacing:1px;font-weight:600;}
.field-value{padding:12px 16px;font-size:15px;color:#f4f6f9;}
.message-box{background:rgba(30,58,95,0.2);border:1px solid rgba(30,58,95,0.6);border-radius:8px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.7;color:#c0c8d8;}
.footer{background:#080c12;padding:20px 32px;text-align:center;color:rgba(192,200,216,0.5);font-size:12px;border-top:1px solid rgba(30,58,95,0.4);}
</style></head><body>
<div class="container">
<div class="header"><div class="logo-text">Sri Tech Engineering</div><div class="tagline">Beyond Technology</div></div>
<div class="body">
<div class="alert-title">🔔 New Project Inquiry Received</div>
<div class="field"><div class="field-label">Full Name</div><div class="field-value">${name}</div></div>
<div class="field"><div class="field-label">Email</div><div class="field-value"><a href="mailto:${email}" style="color:#ff6b2b;">${email}</a></div></div>
${company ? `<div class="field"><div class="field-label">Company</div><div class="field-value">${company}</div></div>` : ''}
<div class="field"><div class="field-label">Service</div><div class="field-value">${service}</div></div>
<div style="margin-bottom:24px;"><div style="font-size:12px;color:#c0c8d8;text-transform:uppercase;letter-spacing:1px;font-weight:600;margin-bottom:8px;">Message</div><div class="message-box">${message}</div></div>
<a href="mailto:${email}?subject=Re: Your Inquiry – Sri Tech Engineering" style="display:inline-block;background:#ff6b2b;color:white;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">Reply to ${name} →</a>
</div>
<div class="footer">© ${new Date().getFullYear()} Sri Tech Engineering | sritechengineering8@gmail.com</div>
</div></body></html>`;
}

function clientAutoReplyTemplate({ name, service }) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
body{font-family:'Segoe UI',Arial,sans-serif;background:#0f1117;color:#f4f6f9;margin:0;padding:0;}
.container{max-width:600px;margin:0 auto;}
.header{background:linear-gradient(135deg,#1e3a5f,#0f1117);padding:40px 32px;text-align:center;border-bottom:3px solid #ff6b2b;}
.body{background:#111825;padding:40px 32px;text-align:center;}
.check{width:64px;height:64px;background:rgba(34,197,94,0.15);border:2px solid rgba(34,197,94,0.4);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:28px;margin-bottom:20px;}
.footer{background:#080c12;padding:20px 32px;text-align:center;color:rgba(192,200,216,0.5);font-size:12px;border-top:1px solid rgba(30,58,95,0.4);}
</style></head><body>
<div class="container">
<div class="header"><div style="font-size:24px;font-weight:700;">Sri Tech Engineering</div><div style="color:#ff6b2b;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin-top:4px;">Beyond Technology</div></div>
<div class="body">
<div class="check">✓</div>
<h2 style="font-size:22px;font-weight:700;margin-bottom:12px;">Thank You, ${name}!</h2>
<p style="color:#c0c8d8;font-size:14px;line-height:1.7;max-width:440px;margin:0 auto 24px;">We've received your inquiry for <strong style="color:#ff6b2b;">${service}</strong>. Our team will respond within <strong style="color:#ff6b2b;">24 business hours</strong>.</p>
<a href="https://sritechengineering.in" style="display:inline-block;background:#ff6b2b;color:white;font-weight:700;padding:12px 28px;border-radius:8px;text-decoration:none;font-size:14px;">Visit Our Website →</a>
</div>
<div class="footer">© ${new Date().getFullYear()} Sri Tech Engineering | Namakkal, Tamil Nadu</div>
</div></body></html>`;
}

// ═══ Serve built frontend in production ═══════════════════════════════════════
const frontendDist = join(__dirname, '../frontend/dist');
try {
    readFileSync(join(frontendDist, 'index.html'));
    app.use(express.static(frontendDist));
    app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) res.sendFile(join(frontendDist, 'index.html'));
    });
    console.log('✅ Serving frontend from dist/');
} catch {
    console.log('ℹ️  Frontend dist not found — API only mode');
}

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Sri Tech Engineering API', time: new Date().toISOString(), db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// 404
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Error handler
app.use((err, _req, res, _next) => {
    console.error('Server error:', err.message);
    if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max 5MB.' });
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`\n🚀 Sri Tech Engineering Backend → http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
