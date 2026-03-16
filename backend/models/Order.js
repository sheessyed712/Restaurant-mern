const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    dishId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
    name: String,
    price: Number,
    quantity: Number
});

const orderSchema = new mongoose.Schema({
    orderId: { type: String, unique: true }, // Human Readable ID
    tableNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Confirmed', 'Preparing', 'Served', 'Paid'], 
        default: 'Pending' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);