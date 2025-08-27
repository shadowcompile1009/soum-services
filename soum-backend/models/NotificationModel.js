const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', true);
var NotificationSchema = new Schema({
    userId: { type: Object },
    seenDate: { type: Date },
    isRead: { type: Boolean, default: false },
    productData: { type: Object, default: {} },
    sellerData: { type: Object, default: {} },
    userData: { type: Object, default: {} },
    activityType: { type: String },
    // status: { type: String, enum: ['Seen', 'Unseen'], default: 'Unseen' },
    createdDate: { type: Date, default: () => { return new Date() } },
    updatedDate: { type: Date, default: () => { return new Date() } },
    askSeller: { type: Object, default: {} }
});

NotificationSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Notification', NotificationSchema);