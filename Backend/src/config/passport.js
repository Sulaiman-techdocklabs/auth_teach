import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.model.js';
import { config } from './env.js';
import { generateToken } from '../services/token.service.js';

// ============================================
// GOOGLE OAUTH STRATEGY
// ============================================
passport.use(
    new GoogleStrategy(
        {
            clientID: config.googleClientId,
            clientSecret: config.googleClientSecret,
            callbackURL: config.googleCallbackUrl
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
               let user = await User.findOne({ googleId: profile.id });
                
                if (user) {
                   const token = generateToken(user._id);
                    return done(null, { user, token });
                }
                
                user = await User.findOne({ email: profile.emails[0].value });
                
                if (user) {
                  user.googleId = profile.id;
                    user.isVerified = true;
                    user.authProvider = 'google';
                    await user.save();
                    
                    const token = generateToken(user._id);
                    return done(null, { user, token });
                }
                
               user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    isVerified: true,
                    authProvider: 'google'
                });
                
                const token = generateToken(user._id);
                return done(null, { user, token });
                
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

export default passport;