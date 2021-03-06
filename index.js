const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { mongoDBUrl, secretKey } = require('./config');

const urls = ['http://localhost:3000', 'https://team-app-fea12-mbs.herokuapp.com'];

const app = express();
app.use(cors({
	credentials: true,
	origin: urls,
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Forwarded-Proto', 'Cookie', 'Set-Cookie'],
	exposedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Forwarded-Proto', 'Cookie', 'Set-Cookie']
}));

if (process.env.NODE_ENV === 'dev') {
	app.use(morgan('dev'));
}

app.use(cookieParser());
app.use(session({
	secret: secretKey,
	resave: false,
	saveUninitialized: false,
	name: 'sessionId',
	cookie: {
		secure: false,
		maxAge: 24 * 60 * 60 * 1000 * 7
	},
	store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport')(passport);

mongoose.connect(
	mongoDBUrl,
	{ useCreateIndex: true, useNewUrlParser: true }
);

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const services = require('./routes/services');
const doctors = require('./routes/doctors');
const shedule = require('./routes/shedule');
const orders = require('./routes/orders');
const reviews = require('./routes/reviews');
const category = require('./routes/category');

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/services', services);
app.use('/api/v1/doctors', doctors);
app.use('/api/v1/shedule', shedule);
app.use('/api/v1/orders', orders);
app.use('/api/v1/reviews', reviews);
app.use('/api/v1/category', category);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
