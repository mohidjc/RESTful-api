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
            const posts = await Post.find({ user: targetUser._id })
            .populate('user restaurant')
            .populate('comments.user');;
            return res.status(200).json(posts);
        }

        return res.status(403).json({ message: "You cannot view this user's posts" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const likePost = async (req, res) => {
    try {
        const { id } = req.params; // ID of the post to like
        const post = await Post.findById(id);
        
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has already liked the post
        if (post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: "You have already liked this post" });
        }

        post.likes.push(req.user.id); // Add user to the list of likes
        await post.save();

        res.status(200).json({ message: "Post liked successfully", likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const unlikePost = async (req, res) => {
    try {
        const { id } = req.params; // ID of the post to unlike
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Check if the user has not liked the post
        if (!post.likes.includes(req.user.id)) {
            return res.status(400).json({ message: "You have not liked this post" });
        }

        // Remove user from the likes array
        post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
        await post.save();

        res.status(200).json({ message: "Post unliked successfully", likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addComment = async (req, res) => {
    try {
        const { id } = req.params; // ID of the post to comment on
        const { text } = req.body; // The comment text

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = {
            user: req.user.id,
            text,
            createdAt: new Date()
        };

        post.comments.push(comment); // Add comment to post
        await post.save();

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params; // IDs of the post and comment
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId); // Find the comment by ID
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Ensure the comment belongs to the current user or the post owner
        if (comment.user.toString() !== req.user.id && post.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        // Remove the comment
        comment.remove();
        await post.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};





module.exports = {
    followingPosts,
    createPost,
    deletePost,
    updatePost,
    getUserPosts,
    likePost,
    unlikePost,
    addComment,
    deleteComment
}