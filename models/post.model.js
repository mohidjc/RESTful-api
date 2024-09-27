const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String, required: true },
    description: { type: String },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    createdAt: { type: Date, default: Date.now },
  });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
