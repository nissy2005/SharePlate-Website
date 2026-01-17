const express = require('express');
const router = express.Router();
const isAdmin = require('../middleware/isAdmin');
const Food = require('../models/food');
const Order = require('../models/order');

// Foods

// Get pending foods
router.get('/foods', isAdmin, async (req, res) => {
  const status = req.query.status || 'pending';
  try {
    const foods = await Food.find({ status });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Add new food 
router.post('/foods', isAdmin, async (req, res) => {
  try {
    const { name, category, description, price } = req.body;
    const food = await Food.create({ name, category, description, price, status: 'pending' });
    res.status(201).json({ message: 'Food added successfully', food });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Approve or Reject food
router.patch('/foods/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await Food.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Food ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Orders

// Place new order 
router.post('/orders', async (req, res) => {
  try {
    const { userId, items } = req.body;

    if (!userId || !items || !items.length)
      return res.status(400).json({ message: 'Invalid order data' });

    const order = await Order.create({ userId, items, status: 'pending' });
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Get all orders
router.get('/orders', isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId')
      .populate('items.foodId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update order status
router.patch('/orders/:id', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    await Order.findByIdAndUpdate(req.params.id, { status });
    res.json({ message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
