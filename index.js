const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { mongoDBUrl } = require('./config');
const { authenticationMiddleware } = require('./utils/help-func');
const User = require('./models/user');

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport')(passport);

passport.serializeUser((user, done) => {
	done(null, { id: user._id });
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => done(err, user));
});

mongoose.connect(
	mongoDBUrl,
	{ useCreateIndex: true, useNewUrlParser: true }
);

app.use(cookieParser());
app.use(session({
	secret: 'my-secret wqweqew',
	resave: false,
	saveUninitialized: true,
	name: 'sessionId',
	cookie: {
		httpOnly: true,
		secure: false,
		maxAge: 24 * 60 * 60 * 1000 * 7
	}
	// store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'dev') {
	app.use(morgan('dev'));
}

// routes
const auth = require('./routes/auth');
const test = require('./routes/test');

app.use('/api/v1/auth', auth);
app.use('/api/v1', authenticationMiddleware, test);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
