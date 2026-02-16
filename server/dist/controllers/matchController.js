"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.matchExperts = void 0;
const User_1 = __importDefault(require("../models/User"));
const Startup_1 = __importDefault(require("../models/Startup"));
const matchExperts = async (req, res) => {
    try {
        const startupId = req.params.startupId;
        const startup = await Startup_1.default.findById(startupId);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        // Basic matching logic based on industry and skills
        const experts = await User_1.default.find({
            role: 'expert',
            $or: [
                { 'profile.expertise': startup.industry },
                { 'profile.skills': { $in: [startup.industry] } }
            ]
        }).limit(10);
        res.json(experts);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.matchExperts = matchExperts;
