const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Hardcoded user
const VALID_USER = {
  id: 'user-001',
  username: 'admin',
  password: 'mypassword'
};

// Session middleware with dynamic cookie settings
app.use(session({
  secret: 'my-super-secret-key-12345',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,           // Set to true in production with HTTPS
    maxAge: null             // Will be overridden per request
  }
}));

// Middleware to dynamically set cookie maxAge after login
function configureSessionCookie(req) {
  const rememberMe = req.body.remember === '1';
  
  if (rememberMe) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  } else {
    req.session.cookie.maxAge = null; // Session cookie → deleted on browser close
  }
}

// Auth middleware
function isAuthenticated(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  res.redirect('/login');
}

// Routes
app.get('/login', (req, res) => {
  const error = req.query.error ? 'Invalid username or password!' : null;
  res.render('login', { error });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === VALID_USER.username && password === VALID_USER.password) {
    // Store user in session
    req.session.userId = VALID_USER.id;
    req.session.username = VALID_USER.username;

    // Configure cookie duration based on "Remember Me"
    configureSessionCookie(req);

    return res.redirect('/profile');
  }

  res.redirect('/login?error=1');
});

app.get('/profile', isAuthenticated, (req, res) => {
  const isLongLived = req.session.cookie.maxAge !== null;
  const expiresIn = isLongLived 
    ? new Date(Date.now() + req.session.cookie.maxAge).toLocaleString()
    : 'when you close the browser';

  res.render('profile', {
    username: req.session.username,
    userId: req.session.userId,
    sessionID: req.sessionID,
    expiresIn,
    isLongLived
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.send('Error logging out');
    }
    res.clearCookie('connect.sid'); // Optional: clear cookie name
    res.redirect('/login');
  });
});

app.get('/', (req, res) => res.redirect('/login'));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Login: admin / mypassword`);
  console.log(`"Remember Me" = 30-day session`);
});