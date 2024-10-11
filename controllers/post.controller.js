const User = require("../models/user.model.js")
const Post = require("../models/post.model.js")

/**
 * @swagger
 * /posts/delete/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by its ID if it exists.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /posts/create:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post for the authenticated user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /posts/update/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by its ID if it belongs to the current user.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *       404:
 *         description: Post not found or unauthorized.
 *       500:
 *         description: Internal server error.
 */
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


/**
 * @swagger
 * /posts/{id}/like:
 *   post:
 *     summary: Like a post
 *     description: Like a post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to like.
 *     responses:
 *       200:
 *         description: Post liked successfully.
 *       400:
 *         description: Already liked the post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
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


/**
 * @swagger
 * /posts/{id}/unlike:
 *   post:
 *     summary: Unlike a post
 *     description: Unlike a post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to unlike.
 *     responses:
 *       200:
 *         description: Post unliked successfully.
 *       400:
 *         description: You have not liked this post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
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


/**
 * @swagger
 * /posts/{id}/comment:
 *   post:
 *     summary: Add a comment to a post
 *     description: Add a comment to a post by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to comment on.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text of the comment.
 *     responses:
 *       201:
 *         description: Comment added successfully.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */
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


/**
 * @swagger
 * /posts/{postId}/comment/{commentId}:
 *   delete:
 *     summary: Delete a comment
 *     description: Delete a comment by its ID if it belongs to the current user or the post owner.
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post.
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the comment to delete.
 *     responses:
 *       200:
 *         description: Comment deleted successfully.
 *       403:
 *         description: Unauthorized to delete this comment.
 *       404:
 *         description: Post or comment not found.
 *       500:
 *         description: Internal server error.
 */
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
    createPost,
    deletePost,
    updatePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment
}