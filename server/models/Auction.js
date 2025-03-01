import mongoose from 'mongoose';

const auctionSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  startingBid: {
    type: Number,
    required: true,
    min: 0
  },
  currentBid: {
    type: Number,
    default: function() {
      return this.startingBid;
    }
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  closingTime: {
    type: Date,
    required: true
  },
  isClosed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  bids: [{
    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    amount: {
      type: Number,
      required: true
    },
    time: {
      type: Date,
      default: Date.now
    }
  }]
});

const Auction = mongoose.model('Auction', auctionSchema);

export default Auction;