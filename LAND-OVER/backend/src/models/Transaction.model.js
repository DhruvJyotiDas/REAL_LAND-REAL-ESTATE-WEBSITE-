const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required'],
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer reference is required'],
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller reference is required'],
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  type: {
    type: String,
    enum: ['sale', 'rent'],
    required: [true, 'Transaction type is required'],
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0, 'Amount cannot be negative'],
  },
  commission: {
    percentage: {
      type: Number,
      min: [0, 'Commission percentage cannot be negative'],
      max: [100, 'Commission percentage cannot exceed 100'],
    },
    amount: {
      type: Number,
      min: [0, 'Commission amount cannot be negative'],
    },
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'cancelled'],
    default: 'pending',
  },
  documents: [{
    name: { type: String, required: true },
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    uploadedAt: { type: Date, default: Date.now },
  }],
  timeline: [{
    stage: {
      type: String,
      enum: ['initiated', 'documents_submitted', 'verification', 'approved', 'completed'],
    },
    date: { type: Date, default: Date.now },
    notes: String,
  }],
  contractDetails: {
    startDate: Date,
    endDate: Date,
    terms: String,
    conditions: String,
  },
  paymentDetails: {
    method: {
      type: String,
      enum: ['cash', 'bank_transfer', 'loan', 'emi'],
    },
    installments: [{
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'paid', 'overdue'],
        default: 'pending',
      },
      paidDate: Date,
    }],
  },
}, {
  timestamps: true,
});

// Indexes
transactionSchema.index({ buyer: 1 });
transactionSchema.index({ seller: 1 });
transactionSchema.index({ agent: 1 });
transactionSchema.index({ property: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });

// Method to add timeline entry
transactionSchema.methods.addTimelineEntry = function(stage, notes = '') {
  this.timeline.push({ stage, notes });
  return this.save();
};

// Method to calculate total commission
transactionSchema.methods.calculateCommission = function() {
  if (this.commission.percentage) {
    this.commission.amount = (this.amount * this.commission.percentage) / 100;
  }
  return this.commission.amount;
};

module.exports = mongoose.model('Transaction', transactionSchema);
