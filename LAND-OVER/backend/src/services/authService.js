const crypto = require('crypto');
const User = require('../models/User.model');
const { generateToken } = require('../config/jwt.config');
const { sendEmail } = require('./emailService');

// Register user service
exports.registerUser = async (userData) => {
  try {
    const { firstName, lastName, email, password, phone, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
      phone,
      role: role || 'buyer'
    });

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    return {
      user,
      verificationToken
    };
  } catch (error) {
    throw new Error(`Registration failed: ${error.message}`);
  }
};

// Login user service
exports.loginUser = async (email, password) => {
  try {
    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new Error('Account is temporarily locked due to too many failed login attempts');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      throw new Error('Invalid credentials');
    }

    // Check if email is verified
    if (!user.isVerified) {
      throw new Error('Please verify your email before logging in');
    }

    // Reset login attempts and update last login
    await user.resetLoginAttempts();

    // Generate JWT token
    const token = generateToken({ id: user._id });

    return {
      user: user.toJSON(), // This will exclude sensitive fields
      token
    };
  } catch (error) {
    throw new Error(`Login failed: ${error.message}`);
  }
};

// Verify email service
exports.verifyEmail = async (token) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Mark email as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Email verification failed: ${error.message}`);
  }
};

// Forgot password service
exports.forgotPassword = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw new Error('No user found with that email');
    }

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    return {
      user,
      resetToken
    };
  } catch (error) {
    throw new Error(`Forgot password failed: ${error.message}`);
  }
};

// Reset password service
exports.resetPassword = async (resetToken, newPassword) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Password reset failed: ${error.message}`);
  }
};

// Update password service
exports.updatePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return user;
  } catch (error) {
    throw new Error(`Password update failed: ${error.message}`);
  }
};

// Resend verification email
exports.resendVerificationEmail = async (email) => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    return {
      user,
      verificationToken
    };
  } catch (error) {
    throw new Error(`Resend verification failed: ${error.message}`);
  }
};

// Get user statistics (for admin)
exports.getUserStats = async () => {
  try {
    const totalUsers = await User.countDocuments();
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    return {
      totalUsers,
      verifiedUsers,
      unverifiedUsers: totalUsers - verifiedUsers,
      usersByRole,
      recentUsers
    };
  } catch (error) {
    throw new Error(`Get user stats failed: ${error.message}`);
  }
};
