var mongoose = require('mongoose');

var imageSchema = new mongoose.Schema({
  imageId: { type: String, unique: true, index: true },
  url: String,
  wins: { type: Number, default: 0 },
  random: { type: [Number], index: '2d' }
});

module.exports = mongoose.model('Image', imageSchema);
