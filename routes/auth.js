const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

// Register
router.post('/register', async (req, res) => {

    // Validate before we create user
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email already exists
    const emailExisit = await User.findOne({email: req.body.email});
    if(emailExisit) return res.status(400).send('Email already exists')

    // Checking if the username already exists
    const emailExisit = await User.findOne({username: req.body.username});
    if(emailExisit) return res.status(400).send('Username already exists')

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch (err) {
        res.status(400).send(err)
    }
});

// Login
router.post('/login', async (req,res) => {

    // Validate before we login user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the user exists
    const user = await User.findOne({username: req.body.username});
    if(!user) return res.status(400).send("Invalid username")

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send("Invalid password")

    // User is logged in provide them with a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

module.exports = router;