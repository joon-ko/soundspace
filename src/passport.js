const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./models/user');

// set up passport configs
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
  User.findOne({ googleid: profile.id }, function (err, user) {
    if (err) return done(err);
    console.log(`User ${profile.displayName} logged in!`);

    if (!user) {
      const user = new User({
        name: profile.displayName,
        googleid: profile.id,
        taps: 0,
        roomsCreated: 0,
        roomsJoined: 0
      });

      user.save(function (err) {
        if (err) console.log(err);

        return done(err, user);
      });
    } else {
      return done(err, user);
    }
  });
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
