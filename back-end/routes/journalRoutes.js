const express = require('express');
const { createJournal, getJournals, getJournalByDate, updateJournal, deleteJournal, getStreak } = require('../controllers/journalController');

const router = express.Router();

// Create a new journal entry
router.post('/', createJournal);
// Get all journal entries for user
router.get('/', getJournals);
// Get a journal entry by date
router.get('/date/:date', getJournalByDate);
// Update a journal entry by id
router.put('/:id', updateJournal);
// Delete a journal entry by id
router.delete('/:id', deleteJournal);
// Get current streak
router.get('/streak/current', getStreak);

module.exports = router;
