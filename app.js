const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('./controllers/authController');

const app = express();
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const authRouter = require('./routes/authRouter');
const transactionRouter = require('./routes/transactionsRouter');
const settingsRouter = require('./routes/settingsRouter');

app.use(auth.session({
    secret: 'my-key-phrase',
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PWD}@mongo:27017/production`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(process.env.NA_PORT))
    .catch((err) => {
        console.log(err),
        res.send('Failed connectiong to databse');
    });

app.use('/auth', authRouter);
app.use('/settings', settingsRouter);
app.use('/', transactionRouter);

app.use((req, res) => {
    res.status(404).render('404', { title: 'Not found', session: req.session });
});