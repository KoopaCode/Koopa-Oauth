const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const { create } = require('express-handlebars');
const chalk = require('chalk');
const User = require('./models/User');
require('dotenv').config();

// Logger setup
const log = {
  info: (msg) => console.log(chalk.blue('ℹ ') + chalk.white(msg)),
  success: (msg) => console.log(chalk.green('✓ ') + chalk.white(msg)),
  error: (msg, err) => console.error(chalk.red('✖ ') + chalk.white(msg), err || '')
};

const app = express();

// Configure Handlebars
const hbs = create({
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }
});

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true
}).then(() => {
  log.success('Connected to MongoDB');
}).catch((err) => {
  log.error('MongoDB connection error:', err);
});

// Middleware setup
app.use(express.json());
app.use(express.static('public'));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport configuration
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  scope: ['identify', 'guilds.join']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ discordId: profile.id });
    
    if (user) {
      // Update existing user
      Object.assign(user, {
        accessToken,
        refreshToken,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar
      });
      await user.save();
      log.info(`Updated user: ${profile.username}`);
    } else {
      // Create new user
      user = await User.create({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        accessToken,
        refreshToken,
        guilds: []
      });
      log.success(`New user verified: ${profile.username}`);
    }
    return done(null, user);
  } catch (error) {
    log.error('Authentication error:', error);
    return done(error, null);
  }
}));

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
  try {
    const user = await User.findOne({ discordId });
    if (!user) return done(null, null);
    done(null, user);
  } catch (error) {
    log.error('Session error:', error);
    done(error, null);
  }
});

// Routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    log.success(`User ${req.user.username} authenticated successfully`);
    res.redirect('/success');
  }
);

app.get('/', (req, res) => {
  res.render('index', { 
    user: req.user ? req.user.toObject() : null,
    title: "Koopa's Services Verification"
  });
});

app.get('/success', (req, res) => {
  if (!req.user) {
    log.error('Unauthorized access attempt to success page');
    return res.redirect('/');
  }
  res.render('success', { 
    user: req.user.toObject(),
    title: 'Verification Successful'
  });
});

// Error handling
app.use((err, req, res, next) => {
  log.error('Server error:', err);
  res.status(500).render('error', { 
    message: 'An error occurred during verification. Please try again.',
    title: 'Verification Error'
  });
});

module.exports = app; 