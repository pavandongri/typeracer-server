const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    lastLogin: {
        type: Date
    },
    lastLoginIPAddress: {
        type: String
    },
    totalRaces: {
        type: Number, default: 0
    },
    racesParticipated: {
        type: Number, default: 0
    },
    racesWon: {
        type: Number, default: 0
    },
    racesLost: {
        type: Number, default: 0
    },
    highestTypingSpeed: {
        type: Number, default: 0
    },
    avgTypingSpeed: {
        type: Number, default: 0
    },
    status: {
        type: String,
        enum: ['Active', 'Deleted'],
        default: 'Active'
    }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (loginPassword, savedPassword) {
    return bcrypt.compare(loginPassword, savedPassword);
};

module.exports = mongoose.model('User', userSchema);