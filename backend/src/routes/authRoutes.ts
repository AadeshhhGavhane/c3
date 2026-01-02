import express from 'express';
import {
  signUp,
  signIn,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from '../controllers/authController';
import { validate } from '../middleware/validation';
import {
  signUpSchema,
  signInSchema,
  sendOTPSchema,
  verifyOTPSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../utils/validation';

const router = express.Router();

router.post('/signup', validate(signUpSchema), signUp);
router.post('/signin', validate(signInSchema), signIn);
router.post('/send-otp', validate(sendOTPSchema), sendOTP);
router.post('/verify-otp', validate(verifyOTPSchema), verifyOTP);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

export default router;

