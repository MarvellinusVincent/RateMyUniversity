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
  
  
module.exports = { submitSchool, submitContactForm };