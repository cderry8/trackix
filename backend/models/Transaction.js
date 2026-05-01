import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    note: { type: String, default: '' },
    source: { type: String, enum: ['manual', 'connected'], default: 'manual' },
    connectionType: { type: String, enum: ['mtn', 'bank'], required: false },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, date: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);
