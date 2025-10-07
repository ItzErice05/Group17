const service = require('../services/userService');

const registerUser = async (req, res) => {
    try {
        const user = await service.registerUser(req.body);
        res.status(201).json(user)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await service.authenticateUser(username, password);
        res.status(200).json(result);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
}

module.exports = {
    registerUser,
    loginUser
};