var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var articleSchema = new Schema({
  headline: {
    type: String,
    unique: true
  },
  summary: String,
  storyUrl: String,
  imgUrl: String,
  byLine: String,
  saved: {
    type: Boolean,
    default: false
  },
  notes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Note"
    }
  ]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;