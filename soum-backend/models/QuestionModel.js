const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', true);

var QuestionModelSchema = new Schema({
    category_id: { type: Schema.Types.ObjectId,ref:"categories" },
    //brand_id: { type: Schema.Types.ObjectId,ref:"brands" },
    //model_id: { type: Schema.Types.ObjectId,ref:"device_models" },
    question: { type: String },
    question_ar: { type: String, default : ""},
    questionType: { type: String },
    options: { type: Array, default:[] },
    weightage: { type: String, default: 0 },
    //selected: { type: Boolean, default: true },
    status: { type: String, default: 'Active' },
    created_at: { type: Date, default: Date.now()},
    updated_at: { type: Date, default: Date.now()}
});

QuestionModelSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.question_id = obj._id;
    delete obj._id;
    return obj;
});

QuestionModelSchema.plugin(mongoosePaginate);
const Question = mongoose.model('master_questions', QuestionModelSchema, 'master_questions');
module.exports = Question;
