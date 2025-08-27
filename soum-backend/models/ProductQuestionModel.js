const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
mongoose.set('debug', true);

var QuestionModelSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId,ref:"Product" },
    user_id: { type: Schema.Types.ObjectId, ref:"user" },
    question: { type: String },
    answer: { type: String, default:"" },
    status: { type: String, default: 'Active' },
    created_at: { type: Date, default: new Date()},
    updated_at: { type: Date, default: new Date()}
});

QuestionModelSchema.method('transform', function() {
    var obj = this.toObject();
    //Rename fields
    obj.question_id = obj._id;
    delete obj._id;
    return obj;
});

QuestionModelSchema.plugin(mongoosePaginate);
const Question = mongoose.model('product_questions', QuestionModelSchema, 'product_questions');
module.exports = Question;
