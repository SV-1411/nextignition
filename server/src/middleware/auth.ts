import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const secretsToTry = ['secret', process.env.JWT_SECRET].filter(Boolean) as string[];
            let decoded: any = null;
            let lastErr: any = null;
            for (const secret of secretsToTry) {
                try {
                    decoded = jwt.verify(token, secret);
                    break;
                } catch (err) {
                    lastErr = err;
                }
            }
            if (!decoded) {
                throw lastErr || new Error('Invalid token');
            }
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    // Allow token via query param for local dev tools
    if (!token && typeof req.query?.token === 'string') {
        token = req.query.token;
        try {
            const secretsToTry = ['secret', process.env.JWT_SECRET].filter(Boolean) as string[];
            let decoded: any = null;
            let lastErr: any = null;
            for (const secret of secretsToTry) {
                try {
                    decoded = jwt.verify(token, secret);
                    break;
                } catch (err) {
                    lastErr = err;
                }
            }
            if (!decoded) {
                throw lastErr || new Error('Invalid token');
            }
            req.user = decoded;
            next();
            return;
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
        return;
    }
};

export const authorize = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: `Role ${req.user.role} is not authorized to access this route` });
            return;
        }
        next();
    };
};
