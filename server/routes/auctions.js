import express from 'express';
import Auction from '../models/Auction.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all auctions
router.get('/', async (req, res) => {
  try {
    const auctions = await Auction.find({ isClosed: false })
      .populate('seller', 'username')
      .populate('highestBidder', 'username')
      .sort({ closingTime: 1 });
    
    res.json(auctions);
  } catch (error) {
    console.error('Get auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single auction by ID
router.get('/:id', async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id)
      .populate('seller', 'username email')
      .populate('highestBidder', 'username')
      .populate('bids.bidder', 'username');
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    res.json(auction);
  } catch (error) {
    console.error('Get auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new auction (protected route)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;
    
    // Validate closing time is in the future
    if (new Date(closingTime) <= new Date()) {
      return res.status(400).json({ message: 'Closing time must be in the future' });
    }

    const newAuction = new Auction({
      itemName,
      description,
      startingBid,
      currentBid: startingBid,
      seller: req.user.userId,
      closingTime
    });

    await newAuction.save();
    
    res.status(201).json({
      message: 'Auction created successfully',
      auction: newAuction
    });
  } catch (error) {
    console.error('Create auction error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Place a bid on an auction (protected route)
router.put('/bid/:id', authenticateToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const auctionId = req.params.id;
    
    const auction = await Auction.findById(auctionId);
    
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    // Check if auction is closed
    if (auction.isClosed) {
      return res.status(400).json({ message: 'This auction is closed' });
    }
    
    // Check if closing time has passed
    if (new Date(auction.closingTime) <= new Date()) {
      auction.isClosed = true;
      await auction.save();
      return res.status(400).json({ message: 'This auction has ended' });
    }
    
    // Check if bid is higher than current bid
    if (amount <= auction.currentBid) {
      return res.status(400).json({ 
        message: 'Bid must be higher than the current bid' 
      });
    }
    
    // Check if user is bidding on their own auction
    if (auction.seller.toString() === req.user.userId) {
      return res.status(400).json({ 
        message: 'You cannot bid on your own auction' 
      });
    }
    
    // Update auction with new bid
    auction.currentBid = amount;
    auction.highestBidder = req.user.userId;
    
    // Add to bid history
    auction.bids.push({
      bidder: req.user.userId,
      amount: amount
    });
    
    await auction.save();
    
    res.json({
      message: 'Bid placed successfully',
      currentBid: auction.currentBid
    });
  } catch (error) {
    console.error('Place bid error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's auctions (protected route)
router.get('/user/auctions', authenticateToken, async (req, res) => {
  try {
    const auctions = await Auction.find({ seller: req.user.userId })
      .populate('highestBidder', 'username')
      .sort({ createdAt: -1 });
    
    res.json(auctions);
  } catch (error) {
    console.error('Get user auctions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bids (protected route)
router.get('/user/bids', authenticateToken, async (req, res) => {
  try {
    const auctions = await Auction.find({
      'bids.bidder': req.user.userId
    })
      .populate('seller', 'username')
      .sort({ closingTime: 1 });
    
    res.json(auctions);
  } catch (error) {
    console.error('Get user bids error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;