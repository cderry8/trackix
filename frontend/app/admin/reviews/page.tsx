'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { api } from '@/lib/api';
import type { Review } from '@/types';
import { Star, CheckCircle, XCircle, Clock, Trash2, MessageSquare, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    averageRating: 0,
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [adminNote, setAdminNote] = useState('');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reviewsRes, statsRes] = await Promise.all([
        api.get(`/reviews/admin/all?status=${filter === 'all' ? '' : filter}`),
        api.get('/reviews/admin/stats'),
      ]);
      setReviews(reviewsRes.data);
      setStats(statsRes.data);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/reviews/admin/${id}/approve`, { adminNotes: adminNote });
      loadData();
      setSelectedReview(null);
      setAdminNote('');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/reviews/admin/${id}/reject`, { adminNotes: adminNote });
      loadData();
      setSelectedReview(null);
      setAdminNote('');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      loadData();
    } catch (err) {
      alert('Failed to delete review');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500">
            <CheckCircle className="h-3 w-3" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-500">
            <Clock className="h-3 w-3" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-500">
            <XCircle className="h-3 w-3" />
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Review Management</h1>
        <p className="text-sm text-ink-muted">Manage user reviews and feedback</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card tilt={false} className="p-4">
          <p className="text-xs text-ink-muted uppercase">Total Reviews</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </Card>
        <Card tilt={false} className="p-4">
          <p className="text-xs text-emerald-500 uppercase">Approved</p>
          <p className="text-2xl font-bold text-emerald-500">{stats.approved}</p>
        </Card>
        <Card tilt={false} className="p-4">
          <p className="text-xs text-amber-500 uppercase">Pending</p>
          <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
        </Card>
        <Card tilt={false} className="p-4">
          <p className="text-xs text-red-500 uppercase">Rejected</p>
          <p className="text-2xl font-bold text-red-500">{stats.rejected}</p>
        </Card>
        <Card tilt={false} className="p-4">
          <p className="text-xs text-ink-muted uppercase">Avg Rating</p>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold">{stats.averageRating}</p>
            <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          </div>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium transition',
              filter === f
                ? 'bg-accent-dim text-white dark:bg-accent dark:text-black'
                : 'bg-ink/5 text-ink-muted hover:bg-ink/10 dark:bg-white/5 dark:hover:bg-white/10'
            )}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <Card tilt={false}>
        {loading ? (
          <div className="p-8 text-center text-ink-muted">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="p-8 text-center text-ink-muted">No reviews found</div>
        ) : (
          <div className="divide-y divide-ink/10 dark:divide-white/10">
            {reviews.map((review) => (
              <div key={review._id} className="p-4 hover:bg-ink/5 dark:hover:bg-white/5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-dim/10 dark:bg-accent/10">
                        <User className="h-4 w-4 text-accent-dim dark:text-accent" />
                      </div>
                      <div>
                        <p className="font-medium">{review.userName}</p>
                        <p className="text-xs text-ink-muted">
                          {format(new Date(review.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      {getStatusBadge(review.status)}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-4 w-4',
                            star <= review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-ink/20 dark:text-white/20'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-ink-muted">{review.comment}</p>
                    {review.adminNotes && (
                      <div className="mt-2 rounded-lg bg-ink/5 p-2 text-xs dark:bg-white/5">
                        <span className="font-medium">Admin note:</span> {review.adminNotes}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {review.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-emerald-500"
                          onClick={() => setSelectedReview(review)}
                          loading={actionLoading === review._id}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500"
                          onClick={() => setSelectedReview(review)}
                          loading={actionLoading === review._id}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-500"
                      onClick={() => handleDelete(review._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal for approve/reject with note */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <div className="border-b border-ink/10 p-4 dark:border-white/10">
              <h3 className="font-semibold">
                {selectedReview.status === 'pending' ? 'Review Action' : 'Update Review'}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <p className="mb-2 text-sm text-ink-muted">Review from {selectedReview.userName}</p>
                <p className="text-sm">{selectedReview.comment}</p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">Admin Note (optional)</label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder="Add a note about this review..."
                  className="w-full rounded-xl border border-ink/15 bg-transparent p-3 text-sm dark:border-white/15"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => {
                    setSelectedReview(null);
                    setAdminNote('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="ghost"
                  className="flex-1 text-red-500"
                  onClick={() => handleReject(selectedReview._id)}
                  loading={actionLoading === selectedReview._id}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleApprove(selectedReview._id)}
                  loading={actionLoading === selectedReview._id}
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// Add cn import
import { cn } from '@/lib/cn';
