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

module.exports = {
    registerUser,
    authenticateUser
};