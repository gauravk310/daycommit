import express from 'express';
import {
    getEntries,
    getEntryByDate,
    createEntry,
    updateEntry,
    deleteEntry,
    getUserStats,
} from '../controllers/entryController.js';

const router = express.Router();

// Entry routes
router.get('/:userId', getEntries);
router.get('/:userId/stats', getUserStats);
router.get('/:userId/:date', getEntryByDate);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
