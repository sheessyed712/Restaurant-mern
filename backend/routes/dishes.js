const router = require('express').Router();
const Dish = require('../models/Dish');

// GET: All dishes (for Admin)
router.get('/all', async (req, res) => {
    const dishes = await Dish.find().sort({ createdAt: -1 });
    res.json(dishes);
});

// GET: Available dishes (for Customer)
router.get('/', async (req, res) => {
    const dishes = await Dish.find({ isAvailable: true });
    res.json(dishes);
});

// POST: Add new dish (Admin)
router.post('/', async (req, res) => {
    try {
        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(201).json(newDish);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT: Toggle Availability or Update
router.put('/:id', async (req, res) => {
    const dish = await Dish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(dish);
});

// DELETE: Dish
router.delete('/:id', async (req, res) => {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
});

module.exports = router;