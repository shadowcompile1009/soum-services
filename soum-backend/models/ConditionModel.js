const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.set('debug', false);

var ConditionModelSchema = new Schema({
    like_new: { type: String, default: "" },
    like_new_price_nudge: { type: String, default: "" },
    light_use: { type: String, default: "" },
    light_use_price_nudge: { type: String, default: "" },
    good_condition: { type: String, default: "" },
    good_condition_price_nudge: { type: String, default: "" },
    extensive_use: { type: String, default: "" },
    extensive_use_price_nudge: { type: String, default: "" },
    like_new_ar: { type: String, default: "" },
    like_new_ar_price_nudge: { type: String, default: "" },
    light_use_ar: { type: String, default: "" },
    light_use_price_nudge_ar: { type: String, default: "" },
    good_condition_ar: { type: String, default: "" },
    good_condition_price_nudge_ar: { type: String, default: "" },
    extensive_use_ar: { type: String, default: "" },
    extensive_use_price_nudge_ar: { type: String, default: "" },
    varient_id: { type: Schema.Types.ObjectId, ref: "varients" },
    timeTillSold: { type: Object },
    timeTillSoldFairPrice: { type: Object, default: {} },
    priceRange: { type: Object },
}, { timestamps: true });

const Condition = mongoose.model('conditions', ConditionModelSchema);
module.exports = Condition;
