import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    provider: 'razorpay';
    user: mongoose.Types.ObjectId;
    purpose: 'event_registration';
    event?: mongoose.Types.ObjectId;
    amount: number; // in paise
    currency: string;

    orderId: string;
    paymentId?: string;
    signature?: string;

    status: 'created' | 'paid' | 'failed';
    notes?: any;

    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema: Schema = new Schema(
    {
        provider: { type: String, enum: ['razorpay'], required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        purpose: { type: String, enum: ['event_registration'], required: true },
        event: { type: Schema.Types.ObjectId, ref: 'Event' },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'INR' },

        orderId: { type: String, required: true },
        paymentId: { type: String },
        signature: { type: String },

        status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
        notes: { type: Schema.Types.Mixed },
    },
    { timestamps: true }
);

PaymentSchema.index({ orderId: 1 }, { unique: true });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
