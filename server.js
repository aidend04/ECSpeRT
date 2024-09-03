const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const cookieParser = require('cookie-parser');
const port = 3000;
const app = express();

app.use(cookieParser());
app.use(express.json());

const path = require('path');


app.use(express.static(path.join(__dirname, './public')));

const ecsStore = new MongoDBStore({
    uri: 'mongodb://localhost:27017/ECS',
    collection: 'mySessions'
});

app.use(session({
    name: 'session_token',
    secret: 'blahblah',
    cookie: { maxAge: 1000 * 60 * 30 },
    store: ecsStore,
    resave: false,
    saveUninitialized: false
}))

mongoose.connect('mongodb://localhost:27017/ECS')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

let loginRouter = require("./routes/login-router");
let registerRouter = require('./routes/register-router');
let adminRouter = require('./routes/admin-router');
let dataRouter = require('./routes/data-router');


app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/data', dataRouter);


app.use(checkLogin);
app.use(checkSessionStatus);

app.use('/admin', adminRouter);

app.get("/user-home", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'user-form.html'));
});

app.get("/user-overnight", (req, res) => {
    res.sendFile(path.join(__dirname, './public', 'userform-overnight.html'));
})

app.get('/', (req, res) => {
    res.sendFile(path
    .join(__dirname, './public', 'home.html'));
})


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/login`)
})

function checkSessionStatus(req, res, next) {
    if (req.session.status === 'unverified') {
        return res.status(403).send('Access denied. Your account is unverified.');
    }
    next();
}

function checkLogin(req, res, next){
    if (req.session.userId !== undefined){
        next();
    } else {
        res.redirect('/login');
    }
}