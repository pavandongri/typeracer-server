const mongoose = require('mongoose');

const raceSchema = new mongoose.Schema({
    players: [{ type: String }],
    paragraph: { type: String },
    status: { type: String, enum: ['waiting', 'started', 'completed'], default: 'waiting' },
    results: [{ userId: String, completionTime: Number }]
},{timestamps: true});

const Race = mongoose.model('Race', raceSchema);

module.exports = Race;
