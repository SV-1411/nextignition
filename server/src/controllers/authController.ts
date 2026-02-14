import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'founder',
            roles: [role || 'founder'],
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id as string, user.role),
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password || ''))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                roles: user.roles,
                profile: user.profile,
                token: generateToken(user._id as string, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user profile by ID
export const getProfile = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update own profile
export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { bio, location, website, skills, experience, expertise, hourlyRate, socials } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update profile fields
        if (bio !== undefined) user.profile.bio = bio;
        if (location !== undefined) user.profile.location = location;
        if (skills !== undefined) user.profile.skills = skills;
        if (experience !== undefined) user.profile.experience = experience;
        if (expertise !== undefined) user.profile.expertise = expertise;
        if (hourlyRate !== undefined) user.profile.hourlyRate = hourlyRate;
        if (socials !== undefined) user.profile.socials = socials;
        if (website !== undefined) {
            if (!user.profile.socials) user.profile.socials = {};
            user.profile.socials.website = website;
        }

        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get users by role (for Discover Experts, Investor Discovery, etc.)
export const getUsersByRole = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        const filter: any = {};
        if (role) filter.role = role;

        const users = await User.find(filter).select('-password').limit(50);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Search users
export const searchUsers = async (req: Request, res: Response) => {
    try {
        const { q, role } = req.query;
        const filter: any = {};

        if (role) filter.role = role;
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { 'profile.bio': { $regex: q, $options: 'i' } },
                { 'profile.skills': { $in: [new RegExp(q as string, 'i')] } },
            ];
        }

        const users = await User.find(filter).select('-password').limit(20);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Switch active role
export const switchRole = async (req: AuthRequest, res: Response) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.roles.includes(role)) {
            // Add the new role to user's available roles
            user.roles.push(role);
        }

        user.role = role;
        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            roles: user.roles,
            profile: user.profile,
            token: generateToken(user._id as string, user.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
