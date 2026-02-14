import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Notification from '../models/Notification';

export const getNotifications = async (req: AuthRequest, res: Response) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findById(id);

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        notification.read = true;
        await notification.save();

        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
    try {
        await Notification.updateMany({ user: req.user.id }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Helper function to create notification (internal use)
export const createNotification = async (
    userId: string,
    type: string,
    title: string,
    content: string,
    link?: string,
    senderId?: string
) => {
    try {
        await Notification.create({
            user: userId,
            type,
            title,
            content,
            link,
            sender: senderId,
        });
    } catch (error) {
        console.error('Failed to create notification', error);
    }
};
