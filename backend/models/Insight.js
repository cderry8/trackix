import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    content: {
      insights: [String],
      warnings: [String],
      recommendations: [String],
      weeklySummary: String,
    },
    period: { type: String, default: 'weekly' },
  },
  { timestamps: true }
);

export const Insight = mongoose.model('Insight', insightSchema);
