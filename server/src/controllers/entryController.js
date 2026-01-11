import DayEntry from '../models/DayEntry.js';

// @desc    Get all entries for a user
// @route   GET /api/entries/:userId
// @access  Public (should be protected with auth in production)
export const getEntries = async (req, res) => {
    try {
        const { userId } = req.params;
        const entries = await DayEntry.find({ userId }).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: entries.length,
            data: entries,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get a single entry for a user by date
// @route   GET /api/entries/:userId/:date
// @access  Public
export const getEntryByDate = async (req, res) => {
    try {
        const { userId, date } = req.params;
        const entry = await DayEntry.findOne({ userId, date });

        if (!entry) {
            return res.status(404).json({
                success: false,
                error: 'Entry not found',
            });
        }

        res.status(200).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Create a new entry
// @route   POST /api/entries
// @access  Public
export const createEntry = async (req, res) => {
    try {
        const { userId, date, status, description, achievement, duration } = req.body;

        // Validation
        if (!userId || !date || !status || !description || !achievement) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields: userId, date, status, description, achievement',
            });
        }

        // Check if entry already exists for this user and date
        const existingEntry = await DayEntry.findOne({ userId, date });
        if (existingEntry) {
            return res.status(400).json({
                success: false,
                error: 'Entry already exists for this date. Use update instead.',
            });
        }

        const entry = await DayEntry.create({
            userId,
            date,
            status,
            description,
            achievement,
            duration,
        });

        res.status(201).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Update an entry
// @route   PUT /api/entries/:id
// @access  Public
export const updateEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, description, achievement, duration } = req.body;

        const entry = await DayEntry.findById(id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                error: 'Entry not found',
            });
        }

        // Update fields
        if (status) entry.status = status;
        if (description) entry.description = description;
        if (achievement) entry.achievement = achievement;
        if (duration !== undefined) entry.duration = duration;

        await entry.save();

        res.status(200).json({
            success: true,
            data: entry,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Delete an entry
// @route   DELETE /api/entries/:id
// @access  Public
export const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        const entry = await DayEntry.findById(id);

        if (!entry) {
            return res.status(404).json({
                success: false,
                error: 'Entry not found',
            });
        }

        await entry.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Entry deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

// @desc    Get user statistics
// @route   GET /api/entries/:userId/stats
// @access  Public
export const getUserStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const entries = await DayEntry.find({ userId }).sort({ date: 1 });

        const completedEntries = entries.filter(e => e.status === 'complete');
        const partialEntries = entries.filter(e => e.status === 'partial');

        // Calculate current streak
        let currentStreak = 0;
        const today = new Date().toISOString().split('T')[0];
        const entriesMap = new Map(entries.map(e => [e.date, e]));

        let checkDate = new Date();
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const entry = entriesMap.get(dateStr);

            if (entry && (entry.status === 'complete' || entry.status === 'partial')) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else if (dateStr === today) {
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }

        // Calculate longest streak
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.status === 'complete' || entry.status === 'partial') {
                if (i === 0) {
                    tempStreak = 1;
                } else {
                    const prevDate = new Date(entries[i - 1].date);
                    const currDate = new Date(entry.date);
                    const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

                    if (diffDays === 1) {
                        tempStreak++;
                    } else {
                        tempStreak = 1;
                    }
                }
                longestStreak = Math.max(longestStreak, tempStreak);
            }
        }

        const totalDays = entries.length;
        const completedDays = completedEntries.length;
        const partialDays = partialEntries.length;
        const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

        res.status(200).json({
            success: true,
            data: {
                currentStreak,
                longestStreak,
                totalDays,
                completedDays,
                partialDays,
                completionRate,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};
