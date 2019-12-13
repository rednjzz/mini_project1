const { User } = require('../models');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcrypt');

module.exports = (passport) => {
  // passport.serializeUser((user, done) => {
  //   done(null, user.id);
  // });
  
  passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email} });
      if (!exUser) {
        done(null, false, { code: 409, message: '가입되지 않은 회원'});
      }
      const result = await bcrypt.compare(password, exUser.password);
      if (!result) {
        done(null, false, { code: 401, message: '비밀번호 불일치'});
      }
      done(null, exUser, { code: 200, message: '성공'}); 
    } catch (err) {
      console.log(err);
      done(err);
    }
  }));
  
  passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.JWT_SECRET,
  }, async (jwtPayload, done) => {
    // find the user in db if needed.
    // This functionality may be omitted if you store everything you'll need in JWT payload.
    try {
      const result = await User.findOne({ where: {id: jwtPayload.id }});
      const user = {
        id: result.id,
        nick: result.nick,
      }
      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: '허가되지 않은 사용자 입니다'});
      }
    } catch (err) {
      console.log(err);
      done(err);
    }
  }));
}