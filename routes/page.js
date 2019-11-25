const express = require('express');
const router  = express.Router();

router.get('/', (req, res) => {
  console.log('pages');
  res.render('main',{
    title: '메인 페이지'
  });
});

module.exports = router;