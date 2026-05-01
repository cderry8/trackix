import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    details: { type: String, default: '' },
  },
  { timestamps: true }
);

adminLogSchema.index({ createdAt: -1 });

export const AdminLog = mongoose.model('AdminLog', adminLogSchema);
