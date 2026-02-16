"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setVerificationBannerState = exports.completeVerification = void 0;
const User_1 = __importDefault(require("../models/User"));
const completeVerification = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.isVerified = true;
        await user.save();
        return res.json({ isVerified: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to complete verification', error: error?.message });
    }
};
exports.completeVerification = completeVerification;
const setVerificationBannerState = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { dismissedUntil } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (dismissedUntil === null) {
            user.verificationBannerDismissedUntil = undefined;
        }
        else if (dismissedUntil) {
            const d = new Date(dismissedUntil);
            if (Number.isNaN(d.getTime())) {
                return res.status(400).json({ message: 'Invalid dismissedUntil' });
            }
            user.verificationBannerDismissedUntil = d;
        }
        else {
            // If not provided, default to dismiss for this session/day
            user.verificationBannerDismissedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        }
        await user.save();
        return res.json({ verificationBannerDismissedUntil: user.verificationBannerDismissedUntil || null });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to update banner state', error: error?.message });
    }
};
exports.setVerificationBannerState = setVerificationBannerState;
