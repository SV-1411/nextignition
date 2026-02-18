"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secretsToTry = ['secret', process.env.JWT_SECRET].filter(Boolean);
            let decoded = null;
            let lastErr = null;
            for (const secret of secretsToTry) {
                try {
                    decoded = jsonwebtoken_1.default.verify(token, secret);
                    break;
                }
                catch (err) {
                    lastErr = err;
                }
            }
            if (!decoded) {
                throw lastErr || new Error('Invalid token');
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }
    // Allow token via query param for local dev tools
    if (!token && typeof req.query?.token === 'string') {
        token = req.query.token;
        try {
            const secretsToTry = ['secret', process.env.JWT_SECRET].filter(Boolean);
            let decoded = null;
            let lastErr = null;
            for (const secret of secretsToTry) {
                try {
                    decoded = jsonwebtoken_1.default.verify(token, secret);
                    break;
                }
                catch (err) {
                    lastErr = err;
                }
            }
            if (!decoded) {
                throw lastErr || new Error('Invalid token');
            }
            req.user = decoded;
            next();
            return;
        }
        catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
};
exports.protect = protect;
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: `Role ${req.user.role} is not authorized to access this route` });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
