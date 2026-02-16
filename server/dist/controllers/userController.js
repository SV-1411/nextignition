"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = void 0;
const User_1 = __importDefault(require("../models/User"));
const uploadAvatar = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
        const avatarUrl = `${baseUrl}/uploads/${file.filename}`;
        user.avatar = avatarUrl;
        await user.save();
        return res.json({ avatar: user.avatar });
    }
    catch (error) {
        return res.status(500).json({ message: 'Avatar upload failed', error: error?.message });
    }
};
exports.uploadAvatar = uploadAvatar;
