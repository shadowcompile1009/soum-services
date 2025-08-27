const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  street: {
    type: String,
  },
  district: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  postal_code: {
    type: String,
  },
  longitude: {
    type: String,
  },
  latitude: {
    type: String,
  },
  is_default: {
    type: Boolean,
    default: false,
  },
  is_verified: {
    type: Boolean,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
  created_date: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updated_date: { type: Date },
  deleted_date: { type: Date }
})

const addressModel = mongoose.model('Address', addressSchema, 'Address')
module.exports = addressModel;