const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
    
    const newUser = new user({ 
        ...userData, 
        password: hashedPassword 
    });
    
    const savedUser = await newUser.save();

    const userObject = savedUser.toObject();
    delete userObject.password;

    return userObject;
}

const authenticateUser = async (username, password) => {
    const existingUser = await user.findOne( { username }).select('+password');
    if (!existingUser) {
        throw new Error('Invalid username or password');
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordValid) {
        throw new Error('Invalid username or password');
    }

    const token = generateAuthToken(existingUser);

    const userObject = existingUser.toObject();
    delete userObject.password;

    return { user: userObject, token };
}

const generateAuthToken = (user) => {
    const payload = {
        id: user._id,
        username: user.username
    };

    return jwt.sign(
        payload,
        process.env.JWT_SECRET || 'fallback_secret',
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '24h',
            issuer: process.env.JWT_ISSUER || 'Task Manager'
        }
    );
}

module.exports = {
    registerUser,
    authenticateUser
};