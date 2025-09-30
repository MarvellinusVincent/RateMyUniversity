const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require('../config/db');
const { sendPasswordResetEmail } = require('./email_controller');

// User Signup
const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const emailCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rows.length > 0) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const usernameCheck = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email`,
      [username, email, hashedPassword]
    );
    
    const newUser = result.rows[0];
    res.status(201).json({ 
      message: "User created successfully", 
      user: newUser 
    });
  } catch (err) {
    console.error("Error during sign up:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User Login
const login = async (req, res) => {
   const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign(
    { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
      [user.id, refreshToken]
    );
    res.json({ 
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      },
      token, 
      refreshToken 
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await pool.query(
        'DELETE FROM refresh_tokens WHERE token = $1', 
        [refreshToken]
      );
    }
    res.json({ 
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      error: 'Logout failed'
    });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' });
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const validToken = await pool.query(
      'SELECT * FROM refresh_tokens WHERE token = $1 AND user_id = $2',
      [refreshToken, decoded.id]
    );
    if (!validToken.rows.length) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    const user = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1', 
      [decoded.id]
    );
    if (!user.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const newToken = jwt.sign(
      { id: user.rows[0].id, username: user.rows[0].username, email: user.rows[0].email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const newRefreshToken = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );
    
    await pool.query('BEGIN');
    
    try {
      await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
      await pool.query(
        'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
        [user.rows[0].id, newRefreshToken]
      );
      await pool.query('COMMIT');
      
      res.json({ 
        token: newToken, 
        refreshToken: newRefreshToken 
      });
    } catch (transactionError) {
      await pool.query('ROLLBACK');
      throw transactionError;
    }
    
  } catch (error) {
    console.error('Refresh error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify User
const verifyUser = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await pool.query(
      'SELECT id, username, email FROM users WHERE id = $1', 
      [decoded.id]
    );
    
    if (!user.rows.length) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    res.json({ 
      user: {
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email
      } 
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};


// Get User
const getUser = async (req, res) => {
  const { userID } = req.query;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userID]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];
    res.json({ username: user.username });

  } catch (error) {
    console.error("Error during getting user: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update Username
const updateUsername = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { username } = req.body;
    const userId = req.user.id;
    if (!username) {
      return res.status(400).json({ error: "Username is required" });
    }
    const result = await pool.query('SELECT id FROM users WHERE username = $1 AND id != $2', [username, userId]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }
    const updateResult = await pool.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING username',
      [username, userId]
    );
    if (updateResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({
      message: "Username updated successfully",
      username: updateResult.rows[0].username,
    });
  } catch (err) {
    console.error("Error during username update:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Password
const updatePassword = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const { newPassword, retypeNewPassword } = req.body;
    const userId = req.user.id;
    if (!newPassword || !retypeNewPassword) {
      return res.status(400).json({ error: "All password fields are required" });
    }
    if (newPassword !== retypeNewPassword) {
      return res.status(400).json({ error: "New passwords do not match" });
    }
    const userResult = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [hashedNewPassword, userId]
    );
    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Error when updating password:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get User Reviews
const getReviews = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = req.user.id;
    const result = await pool.query('SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.status(200).json({ reviews: result.rows });
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete User
const deleteUser = async (req, res) => {
  const client = await pool.connect();
  
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'You must be logged in to delete your account'
      });
    }
    
    const userId = req.user.id;
    
    await client.query('BEGIN');
    
    const userCheck = await client.query(
      'SELECT id, username, email FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The user account does not exist'
      });
    }
    
    const user = userCheck.rows[0];
    
    const deleteResult = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username, email',
      [userId]
    );
    
    if (deleteResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(500).json({ 
        error: 'Failed to delete user',
        message: 'User could not be deleted'
      });
    }
    
    await client.query('COMMIT');
    
    console.log(`Successfully deleted user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Account deleted successfully',
      deleted_user: {
        id: deleteResult.rows[0].id,
        username: deleteResult.rows[0].username,
        email: deleteResult.rows[0].email
      }
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user account:', error);
    res.status(500).json({ 
      error: 'Failed to delete account',
      message: 'Internal server error' 
    });
  } finally {
    client.release();
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const {email}  = req.body;
    if (!email) {
      return res.status(400).json({error: "Email is required"});
    }
    const userResult = await pool.query('SELECT id, username, email FROM users WHERE email = $1', [email]);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const resetToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          type: 'password_reset'
        },
        process.env.JWT_RESET_SECRET,
        { expiresIn: '15m'}
      );
      await pool.query(
        `INSERT INTO password_reset_tokens (user_id, token, expires_at) 
         VALUES ($1, $2, NOW() + INTERVAL '15 minutes') 
         ON CONFLICT (user_id) 
         DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '15 minutes', created_at = NOW()`,
        [user.id, resetToken]
      );
      const resetLink = `${process.env.FRONTEND_URL}/resetPassword?token=${resetToken}`;
      try {
        await sendPasswordResetEmail(user.email, user.username, resetLink);
      } catch (emailError) {
        console.error('Failed to send password reset email:', emailError);
      }
      console.log(`Password reset requested for user ${user.id}`);
    } else {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      console.log(`Password reset requested for non-existent email`);
    }
    res.status(200).json({ 
      message: "If an account with that email exists, we've sent you a password reset link." 
    });
  } catch (error) {
    console.error("Error during forgot password:", error);
    res.status(500).json({error: "Internal server error"});
  }
}

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;
    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      if (decoded.type !== 'password_reset') {
        return res.status(400).json({ error: "Invalid reset token" });
      }
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(400).json({ error: "Reset token has expired. Please request a new one." });
      }
      return res.status(400).json({ error: "Invalid reset token" });
    }
    const tokenResult = await pool.query(
      'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [token, decoded.id]
    );
    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('BEGIN');
    try {
      await pool.query(
        'UPDATE users SET password_hash = $1 WHERE id = $2',
        [hashedPassword, decoded.id]
      );
      await pool.query(
        'DELETE FROM password_reset_tokens WHERE user_id = $1',
        [decoded.id]
      );
      await pool.query(
        'DELETE FROM refresh_tokens WHERE user_id = $1',
        [decoded.id]
      );
      await pool.query('COMMIT');
      console.log(`Password reset successful for user ${decoded.id}`);
      res.status(200).json({ 
        message: "Password reset successfully. Please login with your new password." 
      });
    } catch (transactionError) {
      await pool.query('ROLLBACK');
      throw transactionError;
    }
  } catch (error) {
    console.error("Error during password reset:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const validateResetToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
    const tokenResult = await pool.query(
      'SELECT expires_at FROM password_reset_tokens WHERE token = $1 AND user_id = $2 AND expires_at > NOW()',
      [token, decoded.id]
    );
    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: "Invalid or expired reset token" });
    }
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: "Reset link has expired" });
    }
    return res.status(400).json({ error: "Invalid reset token" });
  }
};

module.exports = { signUp, login, logout, refreshToken, verifyUser, getUser, updateUsername, updatePassword, getReviews, deleteUser, forgotPassword, resetPassword, validateResetToken };
