import { Review } from '../models/Review.js';

export async function create(req, res) {
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({ message: 'Rating and comment are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  if (comment.length > 500) {
    return res.status(400).json({ message: 'Comment must be less than 500 characters' });
  }

  // Check if user already has a pending or approved review
  const existingReview = await Review.findOne({
    userId: req.user.id,
    status: { $in: ['pending', 'approved'] },
  });

  if (existingReview) {
    return res.status(409).json({
      message: 'You already have a review submitted. You can update your existing review.',
      review: existingReview,
    });
  }

  const review = await Review.create({
    userId: req.user.id,
    userName: req.user.name,
    rating,
    comment,
    status: 'pending',
  });

  return res.status(201).json({
    message: 'Review submitted successfully and is pending approval',
    review,
  });
}

export async function update(req, res) {
  const { rating, comment } = req.body;
  const { id } = req.params;

  const review = await Review.findOne({ _id: id, userId: req.user.id });

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  if (review.status === 'rejected') {
    return res.status(400).json({ message: 'Cannot update a rejected review. Submit a new one.' });
  }

  if (rating !== undefined) review.rating = rating;
  if (comment !== undefined) review.comment = comment;
  
  // Reset to pending if it was approved (needs re-approval)
  if (review.status === 'approved') {
    review.status = 'pending';
  }

  await review.save();

  return res.json({
    message: review.status === 'pending' ? 'Review updated and pending approval' : 'Review updated',
    review,
  });
}

export async function listMine(req, res) {
  const reviews = await Review.find({ userId: req.user.id })
    .sort({ createdAt: -1 })
    .limit(10);
  return res.json(reviews);
}

export async function remove(req, res) {
  const { id } = req.params;
  const review = await Review.findOneAndDelete({ _id: id, userId: req.user.id });

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  return res.json({ message: 'Review deleted' });
}

// Admin functions
export async function listAll(req, res) {
  const { status } = req.query;
  const filter = status ? { status } : {};
  
  const reviews = await Review.find(filter)
    .populate('userId', 'name email')
    .populate('reviewedBy', 'name')
    .sort({ createdAt: -1 });
    
  return res.json(reviews);
}

export async function getStats(req, res) {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await Review.countDocuments();
  const approved = await Review.countDocuments({ status: 'approved' });
  const pending = await Review.countDocuments({ status: 'pending' });
  const rejected = await Review.countDocuments({ status: 'rejected' });

  // Calculate average rating for approved reviews
  const avgRating = await Review.aggregate([
    { $match: { status: 'approved' } },
    { $group: { _id: null, avg: { $avg: '$rating' } } },
  ]);

  return res.json({
    total,
    approved,
    pending,
    rejected,
    averageRating: avgRating[0]?.avg?.toFixed(1) || 0,
  });
}

export async function approve(req, res) {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  review.status = 'approved';
  review.reviewedBy = req.user.id;
  review.reviewedAt = new Date();
  if (adminNotes) review.adminNotes = adminNotes;

  await review.save();

  return res.json({ message: 'Review approved', review });
}

export async function reject(req, res) {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  review.status = 'rejected';
  review.reviewedBy = req.user.id;
  review.reviewedAt = new Date();
  if (adminNotes) review.adminNotes = adminNotes;

  await review.save();

  return res.json({ message: 'Review rejected', review });
}

// Public endpoint for landing page
export async function listApproved(req, res) {
  const reviews = await Review.find({ status: 'approved' })
    .select('userName rating comment createdAt')
    .sort({ createdAt: -1 })
    .limit(6);

  return res.json(reviews);
}
