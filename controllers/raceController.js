const fetchParagraph = require('../utils/fetchParagraph');
const Race = require('../models/raceModel');

const createNewRace = async () => {
    const paragraph = await fetchParagraph();

    const newRace = new Race({
        paragraph,
        players: [],
        status: 'waiting'
    });

    return await newRace.save();
};


const getPendingRace = async () => {
    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

    let race = await Race.findOne({
        status: 'waiting',
        $expr: { $lt: [{ $size: "$players" }, 3] },
        createdAt: { $gte: twoMinutesAgo }
    });

    if (!race) {
        race = await createNewRace();
    }

    return race;
};


const joinRace = async (req, res) => {
    try {
        const { userId } = req.body;

        let race = await getPendingRace();

        if (!race.players.includes(userId)) {
            race.players.push(userId);
        }

        await race.save();

        res.status(200).json(race);
    } catch (err) {
        console.error('Error joining race:', err);
        res.status(500).json({ error: 'Failed to join race' });
    }
};


const finishRace = async (req, res) => {
    const { raceId } = req.params;
    const { results } = req.body;

    const race = await Race.findById(raceId);
    if (race) {
        race.status = 'completed';
        race.results = results;
        await race.save();
        res.json({ success: true, race });
    } else {
        res.status(404).json({ success: false, message: 'Race not found.' });
    }
};

const deleteOldRaces = async (req, res) => {
    let time = Number(req.query.time) || 24 * 60 * 60 * 1000

    try {
        const yesterday = new Date(Date.now() - time);
        const result = await Race.deleteMany({ createdAt: { $lte: yesterday } });

        const newRaces = await Race.find();

        return res.status(200).json({
            message: `${result.deletedCount} old races deleted.`,
            newRacesCount: newRaces.length
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


module.exports = {
    getPendingRace,
    joinRace,
    finishRace,
    deleteOldRaces
};
