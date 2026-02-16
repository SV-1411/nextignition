"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRazorpayPayment = exports.createRazorpayOrder = void 0;
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const Payment_1 = __importDefault(require("../models/Payment"));
const Event_1 = __importDefault(require("../models/Event"));
const getRazorpayAuthHeader = () => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keyId || !keySecret)
        return null;
    const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    return { keyId, Authorization: `Basic ${token}` };
};
// POST /api/payments/razorpay/order
const createRazorpayOrder = async (req, res) => {
    try {
        const auth = getRazorpayAuthHeader();
        if (!auth) {
            return res.status(400).json({ message: 'Razorpay is not configured' });
        }
        const { amount, currency, purpose, eventId } = req.body;
        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }
        if (!purpose) {
            return res.status(400).json({ message: 'Purpose is required' });
        }
        if (purpose === 'event_registration') {
            if (!eventId)
                return res.status(400).json({ message: 'eventId is required' });
            const event = await Event_1.default.findById(eventId);
            if (!event)
                return res.status(404).json({ message: 'Event not found' });
        }
        const receipt = `rcpt_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
        const response = await axios_1.default.post('https://api.razorpay.com/v1/orders', {
            amount: Number(amount),
            currency: currency || 'INR',
            receipt,
            notes: {
                purpose,
                eventId,
                userId: req.user.id,
            },
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': auth.Authorization,
            },
        });
        const orderId = response.data.id;
        await Payment_1.default.create({
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
    }
    catch (error) {
        console.error('Razorpay order creation failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to create payment order' });
    }
};
exports.createRazorpayOrder = createRazorpayOrder;
// POST /api/payments/razorpay/verify
const verifyRazorpayPayment = async (req, res) => {
    try {
        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(400).json({ message: 'Razorpay is not configured' });
        }
        const { orderId, paymentId, signature, purpose, eventId } = req.body;
        if (!orderId || !paymentId || !signature) {
            return res.status(400).json({ message: 'Missing verification fields' });
        }
        const expected = crypto_1.default
            .createHmac('sha256', keySecret)
            .update(`${orderId}|${paymentId}`)
            .digest('hex');
        if (expected !== signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
        const payment = await Payment_1.default.findOne({ orderId, user: req.user.id });
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }
        payment.paymentId = paymentId;
        payment.signature = signature;
        payment.status = 'paid';
        await payment.save();
        if (purpose === 'event_registration') {
            if (!eventId)
                return res.status(400).json({ message: 'eventId is required' });
            const event = await Event_1.default.findById(eventId);
            if (!event)
                return res.status(404).json({ message: 'Event not found' });
            const idx = event.registeredUsers.findIndex(u => u.toString() === req.user.id);
            if (idx === -1) {
                event.registeredUsers.push(req.user.id);
                await event.save();
            }
            const populated = await event.populate('hostUser', 'name role avatar isVerified');
            return res.json({ status: 'paid', event: populated });
        }
        res.json({ status: 'paid' });
    }
    catch (error) {
        console.error('Razorpay verify failed:', error?.response?.data || error.message);
        res.status(500).json({ message: 'Failed to verify payment' });
    }
};
exports.verifyRazorpayPayment = verifyRazorpayPayment;
