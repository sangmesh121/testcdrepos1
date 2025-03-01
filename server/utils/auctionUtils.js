import Auction from '../models/Auction.js';

// Function to check and close auctions that have passed their closing time
export const checkAndCloseAuctions = async () => {
  try {
    const now = new Date();
    
    // Find auctions that should be closed
    const expiredAuctions = await Auction.find({
      closingTime: { $lte: now },
      isClosed: false
    });
    
    if (expiredAuctions.length > 0) {
      console.log(`Closing ${expiredAuctions.length} expired auctions`);
      
      // Update all expired auctions to closed status
      await Auction.updateMany(
        { _id: { $in: expiredAuctions.map(auction => auction._id) } },
        { $set: { isClosed: true } }
      );
    }
  } catch (error) {
    console.error('Error in checkAndCloseAuctions:', error);
  }
};