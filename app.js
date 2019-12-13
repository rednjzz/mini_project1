const express = require('express');
const logger = require('morgan');
const flash = require('connect-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
const cors = require('cors');

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const apiRouter = require('./routes/api');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 9001);

app.use(cors());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// app.use(session({
//   resave: false, //변경되지 않아도 저장할것 인가?
//   saveUninitialized: true, // 세션에 저장할 내역이 없어도 저장할것인가?
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true, //클라이언트에서 쿠키 확인 못하도록함
//     secure: false, // true는 https에서만 사용가능
//   },
// }));
// app.use(flash());
app.use(passport.initialize());

app.use('/', pageRouter); 
app.use('/api', apiRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {  //에러 생성
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
})
app.use((err, req, res, next) => { //에러 처리 (브라우져에 에러 내용 출력)
  res.locals.message = err.message; // res.message에 error 메세지를 넣는다
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기 중');
});
