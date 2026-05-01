import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: ['mtn', 'bank'], required: true },
    status: { type: String, enum: ['disconnected', 'connecting', 'connected', 'error'], default: 'disconnected' },
    lastSyncedAt: { type: Date, default: null },
    displayName: { type: String, default: '' },
  },
  { timestamps: true }
);

connectionSchema.index({ userId: 1, type: 1 }, { unique: true });

export const Connection = mongoose.model('Connection', connectionSchema);
