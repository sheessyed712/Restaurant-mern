const router = require('express').Router();
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/admin/register
// @desc    Register admin (Use this ONCE to create your account)
// @access  Public


// router.post('/register', async (req, res) => {
//     try {
//         const { username, password } = req.body;
        
//         // Check if admin already exists
//         let admin = await Admin.findOne({ username });
//         if (admin) {
//             return res.status(400).json({ msg: 'Admin already exists' });
//         }

//         // Create new admin (password hashing is handled in the model)
//         admin = new Admin({ username, password });
//         await admin.save();
        
//         res.status(201).json({ msg: 'Admin registered successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// @route   POST /api/admin/login
// @desc    Authenticate admin and get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if admin exists
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Generate Token
        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });
        
        res.json({ token, admin: { id: admin._id, username: admin.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = router;