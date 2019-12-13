const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/join', async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {session: false}, (authError, user, info) => {
    if (authError || !user) { // 실패시
      console.error(authError);
      return res.status(400).json({
        message: info.message,
        user: user
      });
    }
    const payLoad = {
          id: user.id,
        }
    const token = jwt.sign(payLoad, process.env.JWT_SECRET);
    return res.json({userId:user.id, token:token})
    // req.login(user, (loginError) => {
    //   if (loginError) {
    //     console.error(loginError);
    //     res.send(loginError);
    //   }
    //   const payLoad = {
    //     id: user.id,
    //   }
    //   const token = jwt.sign(payLoad, process.env.JWT_SECRET);
    //   return res.json({userId:user.id, token:token})
    // });
    // generate a signed son web token with the contents of user object and 
    // return it in the response
  })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

router.get('/logout', isLoggedIn, async (req, res) => {

  
  const test2 = await req.session.destroy(); //세션 삭제
  req.logout(); //passport 로그아웃()
  res.redirect('/');
});

module.exports = router;

