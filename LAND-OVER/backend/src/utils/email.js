const nodemailer = require('nodemailer');
const { createTransporter, emailTemplates } = require('../config/email.config');

// Create reusable transporter
let transporter = null;

/**
 * Get or create email transporter
 * @returns {Object} - Nodemailer transporter
 */
const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

/**
 * Verify email configuration
 * @returns {Promise} - Verification result
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = getTransporter();
    await transporter.verify();
    console.log('✅ Email configuration verified successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Email configuration verification failed:', error);
    throw new Error(`Email configuration invalid: ${error.message}`);
  }
};

/**
 * Send basic email
 * @param {Object} options - Email options
 * @returns {Promise} - Email send result
 */
const sendEmail = async (options) => {
  try {
    const transporter = getTransporter();
    
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html
    };

    // Add CC and BCC if provided
    if (options.cc) mailOptions.cc = options.cc;
    if (options.bcc) mailOptions.bcc = options.bcc;

    // Add attachments if provided
    if (options.attachments) mailOptions.attachments = options.attachments;

    const info = await transporter.sendMail(mailOptions);
    
    console.log('📧 Email sent successfully:', {
      messageId: info.messageId,
      to: options.to,
      subject: options.subject
    });

    return {
      success: true,
      messageId: info.messageId,
      response: info.response
    };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send welcome email to new users
 * @param {Object} user - User object
 * @param {String} verificationUrl - Email verification URL
 * @returns {Promise} - Email send result
 */
const sendWelcomeEmail = async (user, verificationUrl) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to LAND OVER</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .features { background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 30px 0; }
            .feature { margin: 15px 0; padding-left: 25px; position: relative; }
            .feature::before { content: "✓"; position: absolute; left: 0; color: #10B981; font-weight: bold; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 32px;">Welcome to LAND OVER!</h1>
                <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your trusted real estate partner</p>
            </div>
            
            <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.firstName}!</h2>
                
                <p style="font-size: 16px; line-height: 1.8; color: #4b5563;">
                    Thank you for joining <strong>LAND OVER</strong>! We're excited to help you find your perfect property or connect with potential buyers.
                </p>
                
                <p style="font-size: 16px; line-height: 1.8; color: #4b5563;">
                    To get started and access all features, please verify your email address:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" class="button">Verify Email Address</a>
                </div>
                
                <div class="features">
                    <h3 style="color: #1f2937; margin-top: 0; text-align: center;">What you can do with LAND OVER:</h3>
                    <div class="feature">Browse thousands of verified properties</div>
                    <div class="feature">Get instant property valuations and market insights</div>
                    <div class="feature">Save and organize your favorite listings</div>
                    <div class="feature">Connect directly with property owners and agents</div>
                    <div class="feature">Track market trends in your preferred locations</div>
                    <div class="feature">List your own properties with professional support</div>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    <strong>Security Note:</strong> This verification link will expire in 24 hours. If you didn't create an account with LAND OVER, please ignore this email.
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: white;">The LAND OVER Team</p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Making real estate simple and accessible</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Welcome to LAND OVER - Verify Your Email',
    html: htmlContent
  });
};

/**
 * Send password reset email
 * @param {Object} user - User object
 * @param {String} resetUrl - Password reset URL
 * @returns {Promise} - Email send result
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - LAND OVER</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 40px 30px; text-align: center; }
            .content { padding: 40px 30px; }
            .button { display: inline-block; background-color: #EF4444; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
            .warning { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 30px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 28px;">Password Reset Request</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">LAND OVER Account Security</p>
            </div>
            
            <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Hi ${user.firstName}!</h2>
                
                <p style="font-size: 16px; line-height: 1.8; color: #4b5563;">
                    We received a request to reset the password for your LAND OVER account.
                </p>
                
                <p style="font-size: 16px; line-height: 1.8; color: #4b5563;">
                    Click the button below to create a new password:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                
                <div class="warning">
                    <h4 style="color: #dc2626; margin-top: 0;">⚠️ Important Security Information:</h4>
                    <ul style="color: #7f1d1d; margin: 0; padding-left: 20px;">
                        <li>This link will expire in <strong>10 minutes</strong> for security</li>
                        <li>You can only use this link once</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Your current password remains unchanged until you create a new one</li>
                    </ul>
                </div>
                
                <p style="font-size: 14px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
                    If you're having trouble clicking the button, copy and paste this URL into your browser:<br>
                    <span style="word-break: break-all; color: #4f46e5;">${resetUrl}</span>
                </p>
            </div>
            
            <div class="footer">
                <p style="margin: 0; font-size: 16px; font-weight: bold; color: white;">The LAND OVER Team</p>
                <p style="margin: 10px 0 0 0; font-size: 14px;">Keeping your account secure</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - LAND OVER',
    html: htmlContent
  });
};

/**
 * Send property inquiry notification to owner
 * @param {Object} owner - Property owner
 * @param {Object} inquirer - Person making inquiry
 * @param {Object} property - Property details
 * @param {Object} inquiry - Inquiry details
 * @returns {Promise} - Email send result
 */
const sendPropertyInquiryEmail = async (owner, inquirer, property, inquiry) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Property Inquiry - LAND OVER</title>
        <style>
            body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
            .header { background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .inquiry-box { background-color: #f8fafc; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .property-info { background-color: #fef7cd; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .button { display: inline-block; background-color: #1E40AF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #1f2937; color: #9ca3af; padding: 20px; text-align: center; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 style="margin: 0; font-size: 24px;">🏠 New Property Inquiry</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone is interested in your property!</p>
            </div>
            
            <div class="content">
                <h2 style="color: #1f2937; margin-top: 0;">Hi ${owner.firstName}!</h2>
                
                <p style="font-size: 16px; color: #4b5563;">
                    Great news! You have received a new inquiry for your property listing.
                </p>
                
                <div class="property-info">
                    <h3 style="margin-top: 0; color: #92400e;">📍 Property: ${property.title}</h3>
                    <p style="margin: 5px 0; color: #92400e;">
                        <strong>Location:</strong> ${property.location?.address}, ${property.location?.city}<br>
                        <strong>Type:</strong> ${property.propertyType} for ${property.listingType}
                    </p>
                </div>
                
                <div class="inquiry-box">
                    <h3 style="margin-top: 0; color: #059669;">👤 Inquirer Details:</h3>
                    <p style="margin: 10px 0; color: #047857;">
                        <strong>Name:</strong> ${inquirer.firstName} ${inquirer.lastName}<br>
                        <strong>Email:</strong> ${inquirer.email}<br>
                        <strong>Phone:</strong> ${inquirer.phone || 'Not provided'}<br>
                        <strong>Inquiry Type:</strong> ${inquiry.type}<br>
                        <strong>Preferred Contact:</strong> ${inquiry.contactPreference}
                    </p>
                    
                    <h4 style="color: #047857; margin-bottom: 10px;">💬 Message:</h4>
                    <div style="background-color: white; padding: 15px; border-radius: 5px; border: 1px solid #d1fae5;">
                        ${inquiry.message}
                    </div>
                </div>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.CLIENT_URL}/dashboard/inquiries" class="button">
                        View & Respond to Inquiry
                    </a>
                </div>
                
                <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="color: #1e40af; margin-top: 0;">💡 Quick Response Tips:</h4>
                    <ul style="color: #1e40af; margin-bottom: 0;">
                        <li>Respond within 24 hours for best results</li>
                        <li>Be professional and provide clear information</li>
                        <li>Schedule a viewing if the inquiry is serious</li>
                        <li>Keep all communication through LAND OVER for security</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p style="margin: 0; color: white; font-weight: bold;">The LAND OVER Team</p>
                <p style="margin: 5px 0 0 0; font-size: 14px;">Connecting property owners with buyers</p>
            </div>
        </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: owner.email,
    subject: `New Inquiry for ${property.title} - LAND OVER`,
    html: htmlContent
  });
};

/**
 * Send bulk email to multiple recipients
 * @param {Array} recipients - Array of recipient objects with email and name
 * @param {String} subject - Email subject
 * @param {String} htmlContent - Email HTML content
 * @param {Object} options - Additional options
 * @returns {Promise} - Bulk send result
 */
const sendBulkEmail = async (recipients, subject, htmlContent, options = {}) => {
  try {
    const transporter = getTransporter();
    const batchSize = options.batchSize || 50;
    const results = { sent: 0, failed: 0, errors: [] };

    // Process in batches to avoid rate limiting
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (recipient) => {
        try {
          const personalizedContent = htmlContent
            .replace(/{{name}}/g, recipient.name || 'User')
            .replace(/{{email}}/g, recipient.email);

          await sendEmail({
            to: recipient.email,
            subject: subject,
            html: personalizedContent
          });

          results.sent++;
        } catch (error) {
          results.failed++;
          results.errors.push({
            email: recipient.email,
            error: error.message
          });
        }
      });

      await Promise.allSettled(batchPromises);
      
      // Wait between batches to respect rate limits
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`📧 Bulk email completed: ${results.sent} sent, ${results.failed} failed`);
    return results;
  } catch (error) {
    console.error('❌ Bulk email failed:', error);
    throw new Error(`Bulk email failed: ${error.message}`);
  }
};

/**
 * Send email with attachments
 * @param {Object} options - Email options with attachments
 * @returns {Promise} - Email send result
 */
const sendEmailWithAttachments = async (options) => {
  try {
    const attachments = options.attachments?.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType
    }));

    return await sendEmail({
      ...options,
      attachments
    });
  } catch (error) {
    console.error('❌ Email with attachments failed:', error);
    throw new Error(`Failed to send email with attachments: ${error.message}`);
  }
};

module.exports = {
  verifyEmailConfig,
  sendEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPropertyInquiryEmail,
  sendBulkEmail,
  sendEmailWithAttachments
};
