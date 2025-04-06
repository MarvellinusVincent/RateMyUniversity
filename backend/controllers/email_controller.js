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
        to: 'vmarvellinus@gmail.com',
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
  
module.exports = { submitSchool };