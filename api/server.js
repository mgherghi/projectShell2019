import express from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import { createConnection } from 'typeorm';
import passport from 'passport';
import config from './config/passport';
import login from './routes/login';
import todo from './routes/todo';
import category from './routes/category';

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json());
app.use(cookieSession({
  name: 'mysession',
  keys: ['vueauthrandomkey'],
  maxAge: 24 * 3600 * 1000, 
}));
app.use(passport.initialize());
app.use(passport.session());
config();

app.use(login(passport));
app.use(todo);
app.use(category);

app.get('/', (_req, res) => {
  res.send('hello world');
});

createConnection().then(() => {
  app.listen(PORT, () => console.log('Example app listening on port 3000!'));
});
