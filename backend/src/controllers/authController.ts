import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { sendOTPEmail } from '../utils/email';
import { AppError } from '../middleware/errorHandler';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware, so we can trust req.body
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      const error: AppError = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isVerified: false,
    });

    // Generate and send OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10'));

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save OTP
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), otp);

    res.status(201).json({
      success: true,
      message: 'User created successfully. OTP sent to email.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      const error: AppError = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }

    // Check if user is verified
    if (!user.isVerified) {
      const error: AppError = new Error('Please verify your email with OTP first');
      error.statusCode = 403;
      throw error;
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user._id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(process.env.OTP_EXPIRY_MINUTES || '10'));

    // Delete any existing OTP for this email
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save OTP
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), otp);

    res.status(200).json({
      success: true,
      message: 'OTP sent to email successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware
    const { email, otp } = req.body;

    // Find OTP
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
    });

    if (!otpRecord) {
      const error: AppError = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      const error: AppError = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    // Mark user as verified
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully. User is now verified.',
      data: {
        userId: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal if user exists or not for security
      res.status(200).json({
        success: true,
        message: 'If the email exists, a password reset OTP has been sent.',
      });
      return;
    }

    // Generate 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

    // Delete any existing OTP for this email (password reset)
    await OTP.deleteMany({ email: email.toLowerCase() });

    // Save OTP to database
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expiresAt,
    });

    // Send OTP email
    await sendOTPEmail(email.toLowerCase(), otp);

    res.status(200).json({
      success: true,
      message: 'If the email exists, a password reset OTP has been sent.',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validation is handled by middleware
    const { email, otp, newPassword } = req.body;

    // Find OTP record
    const otpRecord = await OTP.findOne({
      email: email.toLowerCase(),
      otp,
    });

    if (!otpRecord) {
      const error: AppError = new Error('Invalid or expired OTP');
      error.statusCode = 400;
      throw error;
    }

    // Check if OTP has expired
    if (new Date() > otpRecord.expiresAt) {
      await OTP.deleteOne({ _id: otpRecord._id });
      const error: AppError = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      const error: AppError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedPassword;
    await user.save();

    // Delete used OTP
    await OTP.deleteOne({ _id: otpRecord._id });

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

