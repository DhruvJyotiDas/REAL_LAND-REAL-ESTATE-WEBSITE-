const nodemailer = require('nodemailer');
const { createTransporter, emailTemplates } = require('../config/email.config');

// Create transporter instance
let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

// Send email function
exports.sendEmail = async (options) => {
  try {
    const transporter = getTransporter();
    
    // Verify connection configuration
    await transporter.verify();
    
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
    };

    // Check if using template
    if (options.template && emailTemplates[options.template]) {
      const template = emailTemplates[options.template](
        options.context?.name || 'User',
        options.context?.verificationUrl || options.context?.resetUrl || ''
      );
      
      mailOptions.subject = template.subject;
      mailOptions.html = template.html;
    } else {
      // Use provided text or HTML
      if (options.html) {
        mailOptions.html = options.html;
      } else {
        mailOptions.text = options.text;
      }
    }

    // Send email
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

// Send welcome email
exports.sendWelcomeEmail = async (user, verificationUrl) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #4F46E5; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 28px;">Welcome to LAND OVER!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Your trusted real estate partner</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hi ${user.firstName}!</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          Thank you for joining LAND OVER! We're excited to help you find your perfect property.
        </p>
        
        <p style="font-size: 16px; line-height: 1.6; color: #555;">
          To get started, please verify your email address by clicking the button below:
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" 
             style="background-color: #10B981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;">
            Verify Your Email
          </a>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">What you can do with LAND OVER:</h3>
          <ul style="color: #555; line-height: 1.8;">
            <li>🏠 Browse thousands of verified properties</li>
            <li>💰 Get instant property valuations</li>
            <li>📱 Save your favorite listings</li>
            <li>📞 Connect directly with property owners</li>
            <li>📈 Track market trends in your area</li>
          </ul>
        </div>
        
        <p style="font-size: 14px; color: #888; margin-top: 30px;">
          If you didn't create an account with us, please ignore this email.
        </p>
        
        <div style="border-top: 1px solid #ddd; padding-top: 20px; margin-top: 30px; text-align: center;">
          <p style="font-size: 14px; color: #888; margin: 0;">
            Best regards,<br>
            <strong>The LAND OVER Team</strong>
          </p>
        </div>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: user.email,
    subject: 'Welcome to LAND OVER - Verify Your Email',
    html: htmlContent
  });
};

// Send property inquiry notification  
exports.sendPropertyInquiryEmail = async (owner, inquirer, property, inquiry) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #1E40AF; color: white; padding: 25px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="margin: 0; font-size: 24px;">New Property Inquiry</h1>
        <p style="margin: 5px 0 0 0;">Someone is interested in your property!</p>
      </div>
      
      <div style="background-color: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px;">
        <h2 style="color: #333; margin-top: 0;">Hi ${owner.firstName}!</h2>
        
        <p style="font-size: 16px; color: #555;">
          You have received a new inquiry for your property: <strong>${property.title}</strong>
        </p>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981;">
          <h3 style="margin-top: 0; color: #333;">Inquiry Details:</h3>
          <p><strong>From:</strong> ${inquirer.firstName} ${inquirer.lastName}</p>
          <p><strong>Email:</strong> ${inquirer.email}</p>
          <p><strong>Phone:</strong> ${inquirer.phone || 'Not provided'}</p>
          <p><strong>Inquiry Type:</strong> ${inquiry.type}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px;">
            ${inquiry.message}
          </div>
        </div>
        
        <div style="text-align: center; margin: 25px 0;">
          <a href="${process.env.CLIENT_URL}/dashboard/inquiries" 
             style="background-color: #1E40AF; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            View & Respond
          </a>
        </div>
        
        <p style="font-size: 14px; color: #888;">
          Please respond promptly to maintain good customer relationships.
        </p>
      </div>
    </div>
  `;

  return await this.sendEmail({
    to: owner.email,
    subject: `New Inquiry for ${property.title} - LAND OVER`,
    html: htmlContent
  });
};

// Send bulk email (for newsletters, announcements)
exports.sendBulkEmail = async (recipients, subject, content) => {
  try {
    const transporter = getTransporter();
    const sendPromises = [];

    // Send emails in batches to avoid rate limiting
    const batchSize = 50;
    for (let i = 0; i < recipients.length; i += batchSize) {
      const batch = recipients.slice(i, i + batchSize);
      
      const batchPromises = batch.map(recipient => {
        const mailOptions = {
          from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
          to: recipient.email,
          subject: subject,
          html: content.replace('{{name}}', recipient.name || 'User')
        };
        
        return transporter.sendMail(mailOptions);
      });

      sendPromises.push(...batchPromises);
      
      // Wait a bit between batches
      if (i + batchSize < recipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    const results = await Promise.allSettled(sendPromises);
    
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.filter(result => result.status === 'rejected').length;

    console.log(`📧 Bulk email completed: ${successful} sent, ${failed} failed`);

    return {
      success: true,
      sent: successful,
      failed: failed,
      total: recipients.length
    };
  } catch (error) {
    console.error('❌ Bulk email failed:', error);
    throw new Error(`Failed to send bulk email: ${error.message}`);
  }
};
