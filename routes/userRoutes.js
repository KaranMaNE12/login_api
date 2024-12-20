const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/profile', verifyToken, (req, res) => {
  // access the userId from req.userId
  res.json({ userId: req.userId, message: 'This is a protected route' });
});

module.exports = router;
