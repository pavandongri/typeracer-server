const express = require('express');
const { joinRace, finishRace, deleteOldRaces } = require('../controllers/raceController');
const router = express.Router();

router.post('/join-race', joinRace);
router.post('/finish-race/:raceId', finishRace);
router.get('/delete-old-races', deleteOldRaces);


module.exports = router;
