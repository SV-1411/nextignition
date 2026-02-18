"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyFollowing = exports.unfollowUser = exports.followUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Follow_1 = __importDefault(require("../models/Follow"));
const User_1 = __importDefault(require("../models/User"));
const followUser = async (req, res) => {
    try {
        const me = req.user?.id;
        const otherId = req.params.userId;
        if (!me)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!otherId)
            return res.status(400).json({ message: 'userId is required' });
        if (!mongoose_1.default.Types.ObjectId.isValid(otherId))
            return res.status(400).json({ message: 'Invalid userId' });
        if (String(me) === String(otherId))
            return res.status(400).json({ message: 'Cannot follow yourself' });
        const other = await User_1.default.findById(otherId).select('_id');
        if (!other)
            return res.status(404).json({ message: 'User not found' });
        await Follow_1.default.updateOne({ follower: me, following: otherId }, { $setOnInsert: { follower: me, following: otherId } }, { upsert: true });
        return res.json({ ok: true });
    }
    catch (error) {
        if (error?.code === 11000)
            return res.json({ ok: true });
        return res.status(500).json({ message: 'Failed to follow user', error: error?.message });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    try {
        const me = req.user?.id;
        const otherId = req.params.userId;
        if (!me)
            return res.status(401).json({ message: 'Unauthorized' });
        if (!otherId)
            return res.status(400).json({ message: 'userId is required' });
        if (!mongoose_1.default.Types.ObjectId.isValid(otherId))
            return res.status(400).json({ message: 'Invalid userId' });
        await Follow_1.default.deleteOne({ follower: me, following: otherId });
        return res.json({ ok: true });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to unfollow user', error: error?.message });
    }
};
exports.unfollowUser = unfollowUser;
const getMyFollowing = async (req, res) => {
    try {
        const me = req.user?.id;
        if (!me)
            return res.status(401).json({ message: 'Unauthorized' });
        const rows = await Follow_1.default.find({ follower: me }).select('following');
        const ids = rows.map((r) => String(r.following));
        return res.json({ followingUserIds: ids });
    }
    catch (error) {
        return res.status(500).json({ message: 'Failed to fetch following', error: error?.message });
    }
};
exports.getMyFollowing = getMyFollowing;
