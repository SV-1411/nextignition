"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.switchRole = exports.searchUsers = exports.getUsersByRole = exports.updateProfile = exports.getProfile = exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d',
    });
};
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.default.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.default.create({
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
                avatar: user.avatar,
                token: generateToken(user._id.toString(), user.role),
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (user && (await bcryptjs_1.default.compare(password, user.password || ''))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                roles: user.roles,
                avatar: user.avatar,
                verificationBannerDismissedUntil: user.verificationBannerDismissedUntil,
                profile: user.profile,
                token: generateToken(user._id.toString(), user.role),
            });
        }
        else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.user.id).select('-password');
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
// Get user profile by ID
const getProfile = async (req, res) => {
    try {
        const user = await User_1.default.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getProfile = getProfile;
// Update own profile
const updateProfile = async (req, res) => {
    try {
        const { bio, location, website, skills, experience, expertise, hourlyRate, socials } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Update profile fields
        if (bio !== undefined)
            user.profile.bio = bio;
        if (location !== undefined)
            user.profile.location = location;
        if (skills !== undefined)
            user.profile.skills = skills;
        if (experience !== undefined)
            user.profile.experience = experience;
        if (expertise !== undefined)
            user.profile.expertise = expertise;
        if (hourlyRate !== undefined)
            user.profile.hourlyRate = hourlyRate;
        if (socials !== undefined)
            user.profile.socials = socials;
        if (website !== undefined) {
            if (!user.profile.socials)
                user.profile.socials = {};
            user.profile.socials.website = website;
        }
        await user.save();
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
// Get users by role (for Discover Experts, Investor Discovery, etc.)
const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        const users = await User_1.default.find(filter).select('-password').limit(50);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getUsersByRole = getUsersByRole;
// Search users
const searchUsers = async (req, res) => {
    try {
        const { q, role } = req.query;
        const filter = {};
        if (role)
            filter.role = role;
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { 'profile.bio': { $regex: q, $options: 'i' } },
                { 'profile.skills': { $in: [new RegExp(q, 'i')] } },
            ];
        }
        const users = await User_1.default.find(filter).select('-password').limit(20);
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.searchUsers = searchUsers;
// Switch active role
const switchRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User_1.default.findById(req.user.id);
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
            token: generateToken(user._id.toString(), user.role),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.switchRole = switchRole;
