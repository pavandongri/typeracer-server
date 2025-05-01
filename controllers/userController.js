const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email, and password are required' });
        }

        const user = new User({ username, email, password });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        const passwordMatch = await user.comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
        }

        user.lastLogin = new Date();

        user.lastLoginIPAddress = req.ip;

        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const responseUser = {
            _id: user?._id,
            username: user.username,
            email: user.email,
            racesParticipated: user.racesParticipated,
            racesWon: user.racesWon,
            racesLost: user.racesLost,
            highestTypingSpeed: user.highestTypingSpeed,
            avgTypingSpeed: user.avgTypingSpeed,
            totalRaces: user.totalRaces
        }

        res.json({ token, message: 'Login successful', user: responseUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.status = 'Deleted';
        await user.save();

        res.json({ message: 'User status updated to deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.update = async (req, res) => {
    try {
        const { userId, isRace, racesWon, racesLost, speed } = req.body;

        const user = await User.findById(userId);

        if (!user || !userId) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        user.totalRaces += 1;
        user.racesParticipated += isRace || 0;
        user.racesWon += racesWon || 0;
        user.racesLost += racesLost || 0;

        user.highestTypingSpeed = Math.max(user.highestTypingSpeed, speed);
        user.avgTypingSpeed = Number((user.avgTypingSpeed * (user.totalRaces - 1) + speed) / user.totalRaces).toFixed(2)

        await user.save();

        return res.status(200).json({ user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};