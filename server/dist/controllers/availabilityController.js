"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpecificDateSlots = exports.setSpecificDateSlots = exports.getSpecificDateSlots = exports.getSpecificDateAvailability = exports.getExpertAvailability = exports.deleteAvailability = exports.setAvailability = exports.getMyAvailability = void 0;
const Availability_1 = __importDefault(require("../models/Availability"));
// In-memory storage for specific date slots (until we add a proper model)
const specificDateSlotsMap = new Map();
const getMyAvailability = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const availability = await Availability_1.default.find({ expert: String(req.user.id) }).sort({ dayOfWeek: 1 });
        res.json(availability);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.getMyAvailability = getMyAvailability;
const setAvailability = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { dayOfWeek, slots, unavailableDates } = req.body;
        if (dayOfWeek === undefined || !Array.isArray(slots)) {
            return res.status(400).json({ message: 'dayOfWeek and slots are required' });
        }
        const availability = await Availability_1.default.findOneAndUpdate({ expert: String(req.user.id), dayOfWeek }, { expert: String(req.user.id), dayOfWeek, slots, unavailableDates: unavailableDates || [] }, { new: true, upsert: true });
        res.json(availability);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.setAvailability = setAvailability;
const deleteAvailability = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { dayOfWeek } = req.params;
        await Availability_1.default.findOneAndDelete({
            expert: String(req.user.id),
            dayOfWeek: Number(dayOfWeek)
        });
        res.json({ message: 'Availability deleted' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.deleteAvailability = deleteAvailability;
const getExpertAvailability = async (req, res) => {
    try {
        const { expertId } = req.params;
        const availability = await Availability_1.default.find({ expert: expertId }).sort({ dayOfWeek: 1 });
        res.json(availability);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.getExpertAvailability = getExpertAvailability;
// Get specific date availability for an expert
const getSpecificDateAvailability = async (req, res) => {
    try {
        const { expertId, date } = req.params;
        const expertIdStr = String(expertId);
        const userSpecificSlots = specificDateSlotsMap.get(expertIdStr) || [];
        const dateSlots = userSpecificSlots.find(s => s.date === date);
        if (dateSlots) {
            return res.json(dateSlots);
        }
        // If no specific date slots, return empty
        res.json({ date, slots: [] });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.getSpecificDateAvailability = getSpecificDateAvailability;
// Get my specific date slots
const getSpecificDateSlots = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const userSlots = specificDateSlotsMap.get(String(req.user.id)) || [];
        res.json(userSlots);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.getSpecificDateSlots = getSpecificDateSlots;
// Set specific date slots
const setSpecificDateSlots = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { date, slots } = req.body;
        if (!date || !Array.isArray(slots)) {
            return res.status(400).json({ message: 'date and slots are required' });
        }
        const userId = String(req.user.id);
        const userSlots = specificDateSlotsMap.get(userId) || [];
        const existingIndex = userSlots.findIndex(s => s.date === date);
        if (existingIndex >= 0) {
            userSlots[existingIndex].slots = slots;
        }
        else {
            userSlots.push({ date, slots });
        }
        specificDateSlotsMap.set(userId, userSlots);
        res.json({ date, slots });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.setSpecificDateSlots = setSpecificDateSlots;
// Delete specific date slots
const deleteSpecificDateSlots = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const { date } = req.params;
        const userId = String(req.user.id);
        const userSlots = specificDateSlotsMap.get(userId) || [];
        const filteredSlots = userSlots.filter(s => s.date !== date);
        specificDateSlotsMap.set(userId, filteredSlots);
        res.json({ message: 'Specific date slots deleted' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error', error: error?.message });
    }
};
exports.deleteSpecificDateSlots = deleteSpecificDateSlots;
