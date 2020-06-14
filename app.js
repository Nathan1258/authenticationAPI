const app = require('express')();
const db = require('mongoose');
const dotenv = require('dotenv');
// Import routes
const authRoute = require('./routes/auth');
const getUserRoute = require('./getUser');
const isLoggedIn = require('./isLoggedIn');

dotenv.config();

// Connect to db
db.connect('mongodb://db:27017/users', {useNewUrlParser: true}, (err, client) => {
    if(err) console.log(err)
    else console.log('Connected to db')
});

// Middleware
app.use(express.json());

// Route middlewares
app.use('/users', authRoute);
app.use('/users/get', getUserRoute);
app.use('/users/isloggedin', isLoggedIn);

app.listen(5001, () => console.log('Started app on port 5001'));