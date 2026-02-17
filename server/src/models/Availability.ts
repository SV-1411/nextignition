import mongoose, { Schema, Document } from 'mongoose';

export interface IAvailability extends Document {
    expert: mongoose.Schema.Types.ObjectId;
    dayOfWeek: number; // 0-6 (Sunday-Saturday)
    slots: {
        startTime: string; // HH:mm
        endTime: string;   // HH:mm
    }[];
    unavailableDates: Date[];
    createdAt: Date;
    updatedAt: Date;
}

const AvailabilitySchema: Schema = new Schema(
    {
        expert: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        dayOfWeek: { type: Number, required: true, min: 0, max: 6 },
        slots: [
            {
                startTime: { type: String, required: true },
                endTime: { type: String, required: true },
            },
        ],
        unavailableDates: [{ type: Date }],
    },
    { timestamps: true }
);

// Ensure an expert only has one availability document per day of week
AvailabilitySchema.index({ expert: 1, dayOfWeek: 1 }, { unique: true });

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);
