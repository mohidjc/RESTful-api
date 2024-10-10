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
        return res.status(404).json({ message: "Post not found or you're not authorised" });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  const getUserPosts = async (req, res) => {
    try {
        const { id } = req.params;  // The ID of the user whose posts we want to fetch
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = req.user.following.includes(targetUser._id);
        const isProfilePublic = !targetUser.isPrivate;

        // If the profile is public or the current user is following the user
        if (isProfilePublic || isFollowing) {
            const posts = await Post.find({ user: targetUser._id }).populate('user restaurant');
            return res.status(200).json(posts);
        }

        return res.status(403).json({ message: "You cannot view this user's posts" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    followingPosts,
    createPost,
    deletePost,
    updatePost,
    getUserPosts
}