import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      index: true,
    },
    otp: {
      type: String,
      required: [true, 'OTP is required'],
      length: [4, 'OTP must be exactly 4 digits'],
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create TTL index for automatic cleanup of expired OTPs
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);

