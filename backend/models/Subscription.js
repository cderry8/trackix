import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true },
    provider: { type: String, required: true }, // e.g., 'Netflix', 'Spotify', 'AWS'
    category: { type: String, default: 'entertainment' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly', 'yearly'], default: 'monthly' },
    nextBillingDate: { type: Date, required: true },
    status: { type: String, enum: ['active', 'paused', 'cancelled'], default: 'active' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    icon: { type: String, default: '' }, // URL to icon or emoji
    color: { type: String, default: '#60a5fa' }, // Brand color
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ nextBillingDate: 1 });

export const Subscription = mongoose.model('Subscription', subscriptionSchema);
