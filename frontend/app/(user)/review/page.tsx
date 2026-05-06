'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Review } from '@/types';
import { Star, Send, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadMyReview();
  }, []);

  const loadMyReview = async () => {
    try {
      const res = await api.get('/reviews/my');
      if (res.data.length > 0) {
        setMyReview(res.data[0]);
        setRating(res.data[0].rating);
        setComment(res.data[0].comment);
      }
    } catch (err) {
      console.error('Failed to load review:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setLoading(true);
    try {
      if (myReview && isEditing) {
        await api.patch(`/reviews/${myReview._id}`, { rating, comment: comment.trim() });
        setSuccess('Review updated successfully!');
      } else {
        await api.post('/reviews', { rating, comment: comment.trim() });
        setSuccess('Review submitted successfully! It will be visible after approval.');
      }
      loadMyReview();
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview) return;
    if (!confirm('Are you sure you want to delete your review?')) return;

    try {
      await api.delete(`/reviews/${myReview._id}`);
      setMyReview(null);
      setRating(0);
      setComment('');
      setSuccess('Review deleted successfully');
    } catch (err) {
      setError('Failed to delete review');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'pending':
        return 'Pending Approval';
      case 'rejected':
        return 'Rejected';
      default:
        return status;
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Leave a Review</h1>
        <p className="text-sm text-ink-muted">Share your experience with Trackix</p>
      </div>

      {/* My Review Status */}
      {myReview && !isEditing && (
        <Card tilt={false}>
          <div className="flex items-center justify-between border-b border-ink/10 p-4 dark:border-white/10">
            <h2 className="font-semibold">Your Review</h2>
            <div className="flex items-center gap-2">
              {getStatusIcon(myReview.status)}
              <span className={cn(
                'text-sm font-medium',
                myReview.status === 'approved' && 'text-emerald-500',
                myReview.status === 'pending' && 'text-amber-500',
                myReview.status === 'rejected' && 'text-red-500',
              )}>
                {getStatusText(myReview.status)}
              </span>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    'h-5 w-5',
                    star <= myReview.rating ? 'fill-amber-400 text-amber-400' : 'text-ink/20 dark:text-white/20'
                  )}
                />
              ))}
            </div>
            <p className="text-sm">{myReview.comment}</p>
            <p className="mt-2 text-xs text-ink-muted">
              Submitted on {new Date(myReview.createdAt).toLocaleDateString()}
            </p>
            {myReview.adminNotes && (
              <div className="mt-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-500">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Admin note:</span>
                </div>
                <p>{myReview.adminNotes}</p>
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-ink/10 p-4 dark:border-white/10">
            <Button variant="ghost" onClick={() => setIsEditing(true)}>
              Edit Review
            </Button>
            <Button variant="ghost" className="text-red-500" onClick={handleDelete}>
              Delete Review
            </Button>
          </div>
        </Card>
      )}

      {/* Review Form */}
      {(!myReview || isEditing) && (
        <Card tilt={false}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</div>
            )}
            {success && (
              <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-500">{success}</div>
            )}

            {/* Rating */}
            <div>
              <label className="mb-2 block text-sm font-medium">How would you rate your experience?</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8 transition-colors',
                        (hoverRating ? star <= hoverRating : star <= rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-ink/20 dark:text-white/20'
                      )}
                    />
                  </button>
                ))}
              </div>
              <p className="mt-1 text-xs text-ink-muted">
                {rating > 0 ? `${rating} out of 5 stars` : 'Click to rate'}
              </p>
            </div>

            {/* Comment */}
            <div>
              <label className="mb-2 block text-sm font-medium">Tell us about your experience</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you like about Trackix? How has it helped you manage your finances?"
                className="w-full min-h-[120px] rounded-xl border border-ink/15 bg-transparent p-3 text-sm dark:border-white/15 resize-none"
                maxLength={500}
              />
              <p className="mt-1 text-xs text-ink-muted">{comment.length}/500 characters</p>
            </div>

            {/* Submit */}
            <div className="flex gap-3">
              {isEditing && (
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
              <Button type="submit" loading={loading} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                {isEditing ? 'Update Review' : 'Submit Review'}
              </Button>
            </div>

            <p className="text-xs text-ink-muted text-center">
              Your review will be reviewed by our team before being displayed publicly.
            </p>
          </form>
        </Card>
      )}
    </div>
  );
}

// Add cn import at top
import { cn } from '@/lib/cn';
