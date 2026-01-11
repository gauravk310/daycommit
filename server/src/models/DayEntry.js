import mongoose from 'mongoose';

const dayEntrySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    date: {
        type: String, // ISO date string YYYY-MM-DD
        required: true,
    },
    status: {
        type: String,
        enum: ['none', 'partial', 'complete'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    achievement: {
        type: String,
        required: true,
    },
    duration: {
        type: Number, // in minutes
        required: false,
    },
}, {
    timestamps: true, // This will create createdAt and updatedAt fields automatically
});

// Compound index to ensure one entry per user per date
dayEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

const DayEntry = mongoose.model('DayEntry', dayEntrySchema);

export default DayEntry;
