import { Request, Response } from 'express';
import Startup from '../models/Startup';
import { AuthRequest } from '../middleware/auth';

export const createStartup = async (req: AuthRequest, res: Response) => {
    try {
        const { name, description, industry, stage, location, milestones, funding } = req.body;

        const startup = await Startup.create({
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
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyStartups = async (req: AuthRequest, res: Response) => {
    try {
        const startups = await Startup.find({ founder: req.user.id });
        res.json(startups);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllStartups = async (req: Request, res: Response) => {
    try {
        const startups = await Startup.find().populate('founder', 'name avatar');
        res.json(startups);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateStartup = async (req: AuthRequest, res: Response) => {
    try {
        const startup = await Startup.findById(req.params.id);

        if (!startup) {
            return res.status(404).json({ message: 'Startup not found' });
        }

        if (startup.founder.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedStartup = await Startup.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStartup);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
