const express = require('express');
const {isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router  = express.Router();

router.get('/', (req, res) => {
  res.render('main',{
    title: '메인 페이지',
    user: req.user
  });
});

router.get('/login', isNotLoggedIn, (req, res) => {
  res.render('login', {
    title: '로그인 페이지'
  })
})

router.get('/join', isNotLoggedIn, (req, res) => {
  res.render('join', {
    title: '회원가입',
    joinError: req.flash('joinError')
  });
});

module.exports = router;