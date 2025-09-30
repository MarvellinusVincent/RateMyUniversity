const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const submitSchool = async (req, res) => {
    const { name, country, website, email } = req.body;
  
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'ratemyuniversitymv@gmail.com, vmarvellinus@gmail.com',
        subject: 'New School Submission',
        text: `
          New school submission:
          
          Name: ${name}
          Country: ${country}
          Website: ${website}
          Submitted by: ${email}
        `,
        html: `
          <h1>New school submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Country:</strong> ${country}</p>
          <p><strong>Website:</strong> <a href="${website}">${website}</a></p>
          <p><strong>Submitted by:</strong> ${email}</p>
        `
      };
  
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
};

const submitContactForm = async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ratemyuniversitymv@gmail.com, vmarvellinus@gmail.com',
      subject: `Contact Form: ${subject}`,
      text: `
        New contact form submission:
        
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p>Sent from RateMyUniversity contact form</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending contact form email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

const sendPasswordResetEmail = async (email, username, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - RateMyUniversity',
      text: `
        Hi ${username},
        
        You requested a password reset for your RateMyUniversity account.
        
        Click the link below to reset your password:
        ${resetLink}
        
        This link will expire in 15 minutes for security reasons.
        
        If you didn't request this password reset, please ignore this email.
        
        Best regards,
        RateMyUniversity Team
      `,
      html: `
        <h2>Password Reset Request</h2>
        <p>Hi <strong>${username}</strong>,</p>
        <p>You requested a password reset for your RateMyUniversity account.</p>
        <p>Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" 
             style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>Or copy and paste this link into your browser:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p><strong>This link will expire in 15 minutes</strong> for security reasons.</p>
        <p>If you didn't request this password reset, please ignore this email.</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Best regards,<br>
          RateMyUniversity Team
        </p>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent successfully`);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};
  
  
module.exports = { submitSchool, submitContactForm, sendPasswordResetEmail };