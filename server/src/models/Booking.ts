import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    founder: mongoose.Schema.Types.ObjectId;
    expert: mongoose.Schema.Types.ObjectId;
    date: Date;
    startTime: string;
    duration: number; // in minutes
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    topic: string;
    notes?: string;
    meetingLink?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        founder: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        expert: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        duration: { type: Number, default: 60 },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending'
        },
        topic: { type: String, required: true },
        notes: { type: String },
        meetingLink: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model<IBooking>('Booking', BookingSchema);
