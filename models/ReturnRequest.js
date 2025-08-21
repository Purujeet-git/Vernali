import mongoose from "mongoose";

const ReturnRequestSchema = new mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Order',
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    damaged: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: String,
    },
    photoUrl: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'refunded'],
        default: 'pending',
    },
    requestDate: {
        type: Date,
        default: Date.now,
    },
    processedDate: {
        type: Date,
    },
    rejectionNote: {
        type: String,
    },
    resolutionType: {
        type: String,
        enum: ['refund', 'exchange', 'none'],
        default: 'none',
    }, refundAmount: {
        type: Number,
    }, exchangeProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
});

export default mongoose.models.ReturnRequest || mongoose.model('ReturnRequest', ReturnRequestSchema);
