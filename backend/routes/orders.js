

const router = require('express').Router();
const Order = require('../models/Order');
const Dish = require('../models/Dish'); // Import Dish model to get prices

// Generate simple Order ID
const generateId = () => 'ORD-' + Math.floor(1000 + Math.random() * 9000);

// POST: Place or Update Order
router.post('/place', async (req, res) => {
    const { tableNumber, whatsappNumber, items } = req.body;

    try {
        // 1. Fetch Dish details from Database to ensure correct pricing
        const dishIds = items.map(item => item.dishId);
        const dishesFromDb = await Dish.find({ _id: { $in: dishIds } });

        // 2. Calculate Total Amount securely
        let totalAmount = 0;
        const formattedItems = items.map(inputItem => {
            const dishInfo = dishesFromDb.find(d => d._id.toString() === inputItem.dishId);
            
            if (!dishInfo) throw new Error(`Dish not found: ${inputItem.dishId}`);

            totalAmount += dishInfo.price * inputItem.quantity;

            return {
                dishId: dishInfo._id,
                name: dishInfo.name,
                price: dishInfo.price,
                quantity: inputItem.quantity
            };
        });

        // 3. Check for active order (Smart Logic)
        // Normalize phone number (remove spaces/dashes if any)
        const cleanPhone = whatsappNumber.trim();
        
        let order = await Order.findOne({ 
            whatsappNumber: cleanPhone, 
            status: { $ne: 'Paid' } 
        });

        if (order) {
            // Append items to existing order
            order.items.push(...formattedItems);
            order.totalAmount += totalAmount;
            await order.save();
            return res.json({ message: 'Items added to existing order!', order, isNew: false });
        }

        // 4. Create New Order
        const newOrder = new Order({
            orderId: generateId(),
            tableNumber,
            whatsappNumber: cleanPhone,
            items: formattedItems,
            totalAmount
        });

        await newOrder.save();
        res.json({ message: 'Order placed!', order: newOrder, isNew: true });

    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// ... rest of your routes (track, get, etc) remain the same ...


// POST /track - Customer Tracking
router.post('/track', async (req, res) => {
    const { query } = req.body;
    try {
        const orders = await Order.find({
            $and: [
                { 
                    $or: [
                        { orderId: query },
                        { whatsappNumber: query },
                        { tableNumber: query }
                    ]
                },
                // IMPORTANT: Hide 'Paid' orders from customer view
                { status: { $ne: 'Paid' } } 
            ]
        }).sort({ createdAt: -1 });

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});



// GET: All Orders (Admin)
router.get('/', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

// PUT: Update Status (Admin)
router.put('/:id/status', async (req, res) => {
    const { status } = req.body;
    try{
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    res.json(order);
    }
    catch(err){
        res.status(400).json({ error: err.message });
    }
});

// GET: Analytics Data (Admin)
router.get('/analytics', async (req, res) => {
    const orders = await Order.find();
    
    const totalSales = orders.reduce((acc, o) => acc + o.totalAmount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? Math.round(totalSales / totalOrders) : 0;
    
    // Status Counts
    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {});

    // Last 7 Days Sales (Simplified)
    const dailySales = orders.reduce((acc, o) => {
        const date = new Date(o.createdAt).toLocaleDateString();
        acc[date] = (acc[date] || 0) + o.totalAmount;
        return acc;
    }, {});

    res.json({ totalSales, totalOrders, avgOrderValue, statusCounts, dailySales });
});

module.exports = router;