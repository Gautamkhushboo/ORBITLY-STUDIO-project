import { Response } from 'express';
import { User } from '../models';
import { comparePassword, hashPassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { AuthenticatedRequest } from '../middleware/auth';
import { getDatabaseStatus, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } from '../config';

/**
 * Admin / User Login
 * POST /api/auth/login
 */
export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // In development or test environments where MongoDB is not connected,
    // verify against seeded admin credentials with full bcrypt hashing and comparison
    if (getDatabaseStatus() !== 'connected') {
      if (!ADMIN_PASSWORD || email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const hashedAdminPassword = await hashPassword(ADMIN_PASSWORD);
      const isMatch = await comparePassword(password, hashedAdminPassword);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
      }

      const token = generateToken({
        id: 'dev-admin-id',
        email: ADMIN_EMAIL,
        role: 'admin',
      });

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 'dev-admin-id',
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: 'admin',
        },
      });
    }

    // When MongoDB is connected, query the User database
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password with bcrypt
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT
    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Safe user object without password
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: safeUser,
    });
  } catch (error: any) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
    });
  }
};


/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (getDatabaseStatus() === 'connected') {
      const user = await User.findById(req.user.id).select('-password');
      if (user) {
        return res.status(200).json({
          success: true,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.email === ADMIN_EMAIL ? ADMIN_NAME : 'Authenticated User',
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error: any) {
    console.error('getMe error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error fetching user profile',
    });
  }
};

/**
 * Admin role test route
 * GET /api/auth/admin-test
 */
export const adminTest = async (req: AuthenticatedRequest, res: Response) => {
  return res.status(200).json({
    success: true,
    message: 'Admin authorization verified successfully',
    user: {
      id: req.user?.id,
      email: req.user?.email,
      role: req.user?.role,
    },
  });
};
