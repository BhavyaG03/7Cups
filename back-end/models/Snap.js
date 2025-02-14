const mongoose = require('mongoose');

const SnapSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    listenerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    room_id:{type:String , required:true}
  },
  { timestamps: true }
);

module.exports = mongoose.model('Snap', SnapSchema);
