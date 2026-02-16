"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStartup = exports.getAllStartups = exports.getMyStartups = exports.createStartup = void 0;
const Startup_1 = __importDefault(require("../models/Startup"));
const createStartup = async (req, res) => {
    try {
        const { name, description, industry, stage, location, milestones, funding } = req.body;
        const startup = await Startup_1.default.create({
            founder: req.user.id,
            name,
            description,
            industry,
            stage,
            location,
            milestones,
            funding,
        });
        res.status(201).json(startup);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createStartup = createStartup;
const getMyStartups = async (req, res) => {
    try {
        const startups = await Startup_1.default.find({ founder: req.user.id });
        res.json(startups);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMyStartups = getMyStartups;
const getAllStartups = async (req, res) => {
    try {
        const startups = await Startup_1.default.find().populate('founder', 'name avatar');
        res.json(startups);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getAllStartups = getAllStartups;
const updateStartup = async (req, res) => {
    try {
        const startup = await Startup_1.default.findById(req.params.id);
        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        if (startup.founder.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const updatedStartup = await Startup_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStartup);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateStartup = updateStartup;
