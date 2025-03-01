export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Bid {
  _id: string;
  bidder: {
    _id: string;
    username: string;
  };
  amount: number;
  time: string;
}

export interface Auction {
  _id: string;
  itemName: string;
  description: string;
  startingBid: number;
  currentBid: number;
  highestBidder: {
    _id: string;
    username: string;
  } | null;
  seller: {
    _id: string;
    username: string;
    email?: string;
  };
  closingTime: string;
  isClosed: boolean;
  createdAt: string;
  bids: Bid[];
}