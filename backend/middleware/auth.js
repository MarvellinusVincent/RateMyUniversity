const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const authenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
        
        if (!user.rows.length) {
            return res.status(401).json({ error: 'User not found' });
        }
        req.user = user.rows[0];
        req.token = token;
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expired' });
        }
        res.status(401).json({ error: 'Invalid token' });
    }
};

const refreshTokens = async (req, res) => {
    try {
        const { refreshToken } = req.body;
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
        const user = await pool.query('SELECT id, username, email FROM users WHERE id = $1', [decoded.id]);
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
        await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
        await pool.query(
            'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
            [user.rows[0].id, newRefreshToken]
        );
        await pool.query('COMMIT');
        res.json({ token: newToken, refreshToken: newRefreshToken });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error refreshing tokens:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { authenticate, refreshTokens };