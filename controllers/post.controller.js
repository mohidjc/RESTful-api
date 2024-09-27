const User = require("../models/user.model.js")
const Post = require("../models/post.model.js")

const followingPosts = async (req, res)=>{
    try {
        const currentUser = await User.findById(req.user.id).populate('following');
        const posts = await Post.find({ user: { $in: currentUser.following } }).populate('user restaurant');
        res.json(posts);
      } catch (err) {
        res.status(500).json({ error: err.message });
      } 
}


const deletePost = async (req, res)=>{
    try{
        const { id } = req.params;
        const post = await Post.findByIdAndDelete(id);
        if (!post){
            return res.status(404).json({message:"post not found"});
        }
        res.status(200).json({message:"post deleted successfully"});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}


const createPost = async (req, res) => {
    try {
      const post = new Post({
        ...req.body,
        user: req.user.id 
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}


const updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findOneAndUpdate(
        { _id: id, user: req.user.id },
        req.body,
        { new: true }
      );
      if (!post) {
        return res.status(404).json({ message: "Post not found or you're not authorized" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = {
    followingPosts,
    createPost,
    deletePost,
    updatePost
}