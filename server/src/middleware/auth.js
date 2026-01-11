import { verifyToken } from '../utils/jwt.js';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    error: 'Not authorized, token invalid',
                });
            }

            // Get user from token (exclude password)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
            }

            next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({
                success: false,
                error: 'Not authorized, token failed',
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Not authorized, no token',
        });
    }
};
