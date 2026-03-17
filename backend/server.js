const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();



const app = express();


app.use(cors({ origin: '*', credentials: true }));


app.use(express.json({ limit: '10mb' })); // Handle large image strings


// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ MongoDB Error:", err));

// Routes
const dishRoutes = require('./routes/dishes');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);




// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
const port = process.env.PORT || 5000; // Use this line
app.listen(port, () => console.log(`Server running on port ${port}`));