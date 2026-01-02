import nodemailer from 'nodemailer';

// Lazy load environment variables to ensure dotenv.config() has run
const getGmailUser = () => process.env.GMAIL_USER;
const getGmailAppPassword = () => process.env.GMAIL_APP_PASSWORD;

// Check credentials on first use
let credentialsChecked = false;
const checkCredentials = () => {
  if (!credentialsChecked) {
    const user = getGmailUser();
    const password = getGmailAppPassword();
    if (!user || !password) {
      console.warn('⚠️  Gmail credentials not configured. Email functionality will not work.');
      console.warn('   Make sure GMAIL_USER and GMAIL_APP_PASSWORD are set in your .env file');
    } else {
      console.log('✅ Gmail credentials configured');
    }
    credentialsChecked = true;
  }
};

const getTransporter = () => {
  checkCredentials();
  const user = getGmailUser();
  const password = getGmailAppPassword();
  
  if (!user || !password) {
    return null;
  }
  
  // Use explicit SMTP configuration for better compatibility with Railway
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user,
      pass: password,
    },
    // Connection timeout settings for Railway
    connectionTimeout: 60000, // 60 seconds
    socketTimeout: 60000, // 60 seconds
    greetingTimeout: 30000, // 30 seconds
    // Retry settings
    pool: true,
    maxConnections: 1,
    maxMessages: 3,
    // Additional options for Railway
    tls: {
      rejectUnauthorized: false, // Railway might have certificate issues
    },
  });
};

export const sendOTPEmail = async (email: string, otp: string): Promise<void> => {
  const user = getGmailUser();
  const password = getGmailAppPassword();
  
  if (!user || !password) {
    console.log(`📧 OTP for ${email}: ${otp} (Email not configured, printing to console)`);
    return;
  }

  const transporter = getTransporter();
  if (!transporter) {
    console.log(`📧 OTP for ${email}: ${otp} (Email not configured, printing to console)`);
    return;
  }

  const mailOptions = {
    from: user,
    to: email,
    subject: 'C3 Canteen - OTP Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ec7f13;">C3 College Canteen Catalog</h2>
        <p>Your OTP verification code is:</p>
        <div style="background-color: #f3ede7; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #ec7f13; font-size: 32px; margin: 0; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes.</p>
        <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  };

  try {
    // Verify connection before sending
    await transporter.verify();
    console.log('✅ SMTP server connection verified');
    
    // Send email with timeout
    await Promise.race([
      transporter.sendMail(mailOptions),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Email send timeout')), 30000)
      ),
    ]);
    
    console.log(`✅ OTP email sent to ${email}`);
  } catch (error: any) {
    console.error('❌ Error sending OTP email:', error);
    
    // More detailed error logging
    if (error.code === 'ETIMEDOUT') {
      console.error('   Connection timeout - Railway may be blocking SMTP connections');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('   Connection refused - Check SMTP server settings');
    } else if (error.code === 'EAUTH') {
      console.error('   Authentication failed - Check Gmail credentials');
    }
    
    throw new Error('Failed to send OTP email');
  }
};


