import express from 'express';
import {
    getEntries,
    getEntryByDate,
    createEntry,
    updateEntry,
    deleteEntry,
    getUserStats,
} from '../controllers/entryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All entry routes are protected - require authentication
router.use(protect);

// Entry routes
router.get('/', getEntries);
router.get('/stats', getUserStats);
router.get('/:date', getEntryByDate);
router.post('/', createEntry);
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);

export default router;
