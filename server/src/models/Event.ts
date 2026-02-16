import mongoose, { Schema, Document } from 'mongoose';

export type EventType = 'webinar' | 'workshop' | 'demo-day' | 'networking' | 'masterclass';
export type EventStatus = 'draft' | 'upcoming' | 'live' | 'completed' | 'cancelled';
export type EventFormat = 'virtual' | 'in-person';

export interface IEvent extends Document {
    title: string;
    description: string;
    type: EventType;
    category?: string;
    tags: string[];

    hostType: 'platform' | 'expert' | 'investor' | 'founder';
    hostUser?: mongoose.Types.ObjectId;

    status: EventStatus;
    startAt: Date;
    durationMinutes: number;
    format: EventFormat;
    location?: string;
    meetingLink?: string;

    priceType: 'free' | 'paid';
    priceAmount?: number;
    currency: string;

    maxAttendees?: number;
    registeredUsers: mongoose.Types.ObjectId[];
    bookmarkedBy: mongoose.Types.ObjectId[];

    thumbnailUrl?: string;
    recordingUrl?: string;

    createdAt: Date;
    updatedAt: Date;
}

const EventSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
            type: String,
            enum: ['webinar', 'workshop', 'demo-day', 'networking', 'masterclass'],
            required: true,
        },
        category: { type: String },
        tags: [{ type: String }],

        hostType: {
            type: String,
            enum: ['platform', 'expert', 'investor', 'founder'],
            required: true,
        },
        hostUser: { type: Schema.Types.ObjectId, ref: 'User' },

        status: {
            type: String,
            enum: ['draft', 'upcoming', 'live', 'completed', 'cancelled'],
            default: 'draft',
        },
        startAt: { type: Date, required: true },
        durationMinutes: { type: Number, default: 60 },
        format: { type: String, enum: ['virtual', 'in-person'], default: 'virtual' },
        location: { type: String },
        meetingLink: { type: String },

        priceType: { type: String, enum: ['free', 'paid'], default: 'free' },
        priceAmount: { type: Number },
        currency: { type: String, default: 'INR' },

        maxAttendees: { type: Number },
        registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
        bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],

        thumbnailUrl: { type: String },
        recordingUrl: { type: String },
    },
    { timestamps: true }
);

EventSchema.index({ startAt: 1, status: 1 });
EventSchema.index({ type: 1, status: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
