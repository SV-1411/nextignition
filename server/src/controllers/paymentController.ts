import { Response } from 'express';
import crypto from 'crypto';
import axios from 'axios';
import { AuthRequest } from '../middleware/auth';
import Payment from '../models/Payment';
import Event from '../models/Event';

const getRazorpayAuthHeader = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret) return null;
    const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    return { keyId, Authorization: `Basic ${token}` };
};

// POST /api/payments/razorpay/order
export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
    try {
        const auth = getRazorpayAuthHeader();
        if (!auth) {
            return res.status(400).json({ message: 'Razorpay is not configured' });
        }

        const { amount, currency, purpose, eventId } = req.body as {
            amount: number;
            currency?: string;
            purpose: 'event_registration';
            eventId?: string;
        };

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        if (!purpose) {
            return res.status(400).json({ message: 'Purpose is required' });
        }

        if (purpose === 'event_registration') {
            if (!eventId) return res.status(400).json({ message: 'eventId is required' });
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ message: 'Event not found' });
        }

        const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

        const response = await axios.post(
            'https://api.razorpay.com/v1/orders',
            {
                amount: Number(amount),
                currency: currency || 'INR',
                receipt,
                notes: {
                    purpose,
                    eventId,
                    userId: req.user.id,
                },
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth.Authorization,
                },
            }
        );

        const orderId = response.data.id;

        await Payment.create({
            provider: 'razorpay',
            user: req.user.id,
            purpose,
            event: eventId,
            amount: Number(amount),
            currency: currency || 'INR',
            orderId,
            status: 'created',
            notes: response.data.notes,
        });

        res.json({
            keyId: auth.keyId,
            orderId,
            amount: response.data.amount,
            currency: response.data.currency,
        });
    } catch (error: any) {
        console.error('Razorpay order creation failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};

// POST /api/payments/razorpay/verify
export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
    try {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(400).json({ message: 'Razorpay is not configured' });
        }

        const { orderId, paymentId, signature, purpose, eventId } = req.body as {
            orderId: string;
            paymentId: string;
            signature: string;
            purpose: 'event_registration';
            eventId?: string;
        };

        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({ message: 'Missing verification fields' });
        }

        const expected = crypto
            .createHmac('sha256', keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');

        if (expected !== signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const payment = await Payment.findOne({ orderId, user: req.user.id });
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'paid';
        await payment.save();

        if (purpose === 'event_registration') {
            if (!eventId) return res.status(400).json({ message: 'eventId is required' });
            const event = await Event.findById(eventId);
            if (!event) return res.status(404).json({ message: 'Event not found' });

            const idx = event.registeredUsers.findIndex(u => u.toString() === req.user.id);
            if (idx === -1) {
                event.registeredUsers.push(req.user.id as any);
                await event.save();
            }

            const populated = await event.populate('hostUser', 'name role avatar isVerified');
            return res.json({ status: 'paid', event: populated });
        }

        res.json({ status: 'paid' });
    } catch (error: any) {
        console.error('Razorpay verify failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to verify payment' });
    }
};
