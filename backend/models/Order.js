const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      quantity: Number
    }
  ],
  deliveryLocation: {
    lat: Number,
    lng: Number
  },
  status: { type: String, default: 'pending' } 
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
