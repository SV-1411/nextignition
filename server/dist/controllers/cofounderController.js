"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserPublic = exports.upsertMyCofounderProfile = exports.listSavedCofounders = exports.saveCofounder = exports.listCofounders = void 0;
const User_1 = __importDefault(require("../models/User"));
const CofounderProfile_1 = __importDefault(require("../models/CofounderProfile"));
const CofounderSave_1 = __importDefault(require("../models/CofounderSave"));
const listCofounders = async (req, res) => {
    try {
        const skill = req.query.skill?.trim();
        const location = req.query.location?.trim();
        const commitment = req.query.commitment?.trim();
        const startupStatus = req.query.startupStatus?.trim();
        const filter = { isActive: true };
        if (commitment)
            filter.commitment = commitment;
        if (startupStatus && startupStatus !== 'all')
            filter.startupStatus = startupStatus;
        if (location)
            filter.location = { $regex: location, $options: 'i' };
        if (skill)
            filter.skills = { $in: [skill] };
        const profiles = await CofounderProfile_1.default.find(filter)
            .populate('user', 'name avatar role profile')
            .sort({ updatedAt: -1 })
            .limit(50);
        res.json(profiles);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listCofounders = listCofounders;
const saveCofounder = async (req, res) => {
    try {
        const cofounderUserId = String(req.params.userId);
        const userId = String(req.user.id);
        const existing = await CofounderSave_1.default.findOne({ user: userId, cofounderUser: cofounderUserId });
        if (existing) {
            await CofounderSave_1.default.deleteOne({ _id: existing._id });
            return res.json({ saved: false });
        }
        await CofounderSave_1.default.create({ user: userId, cofounderUser: cofounderUserId });
        res.json({ saved: true });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.json({ saved: true });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
exports.saveCofounder = saveCofounder;
const listSavedCofounders = async (req, res) => {
    try {
        const saved = await CofounderSave_1.default.find({ user: req.user.id }).select('cofounderUser');
        res.json(saved.map(s => String(s.cofounderUser)));
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listSavedCofounders = listSavedCofounders;
const upsertMyCofounderProfile = async (req, res) => {
    try {
        const { currentRole, lookingFor, commitment, equityExpectation, yearsExperience, previousStartups, availability, vision, strengths, interests, skills, location, startupStatus, isActive, } = req.body;
        const updated = await CofounderProfile_1.default.findOneAndUpdate({ user: req.user.id }, {
            user: req.user.id,
            currentRole,
            lookingFor,
            commitment,
            equityExpectation,
            yearsExperience,
            previousStartups,
            availability,
            vision,
            strengths: Array.isArray(strengths) ? strengths : [],
            interests: Array.isArray(interests) ? interests : [],
            skills: Array.isArray(skills) ? skills : [],
            location,
            startupStatus,
            isActive: typeof isActive === 'boolean' ? isActive : true,
        }, { new: true, upsert: true }).populate('user', 'name avatar role profile');
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.upsertMyCofounderProfile = upsertMyCofounderProfile;
const getUserPublic = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.userId).select('name avatar role profile');
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUserPublic = getUserPublic;
