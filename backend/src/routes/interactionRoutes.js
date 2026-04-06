const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const authMiddleware = require('../middleware/requireAuth');

// all interaction routes require an active session
// can only view/modify watchlists of logged in user
router.get('/', authMiddleware, interactionController.getWatchlist);
router.post('/', authMiddleware, interactionController.addToWatchlist);
router.put('/:interactionId/watched', authMiddleware, interactionController.markAsWatched);
router.delete('/:interactionId', authMiddleware, interactionController.removeFromWatchlist);

module.exports = router;