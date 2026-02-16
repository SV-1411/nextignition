"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_1 = __importDefault(require("../models/Notification"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification_1.default.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification_1.default.findById(id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        notification.read = true;
        await notification.save();
        res.json({ message: 'Marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_1.default.updateMany({ user: req.user.id }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.markAllAsRead = markAllAsRead;
// Helper function to create notification (internal use)
const createNotification = async (userId, type, title, content, link, senderId) => {
    try {
        await Notification_1.default.create({
            user: userId,
            type,
            title,
            content,
            link,
            sender: senderId,
        });
    }
    catch (error) {
        console.error('Failed to create notification', error);
    }
};
exports.createNotification = createNotification;
