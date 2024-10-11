const User = require("../models/user.model.js")
const Post = require("../models/post.model.js")

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * /users/user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 following:
 *                   type: array
 *                   items:
 *                     type: string
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: string
 *                 isPrivate:
 *                   type: boolean
 *       404:
 *         description: User not found
 *       500:
 *         description: Error fetching user
 */
const getUser = async (req, res)=>{
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/**
 * @swagger
 * /users/update/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const updateUser = async (req, res)=>{
    try{
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        if (!user){
            return res.status(404).json({message:"user not found"});
        }
        const updatedUser = await User.findById(id);
        res.status(200).json(updatedUser);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/**
 * @swagger
 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
const deleteUser = async (req, res)=>{
    try{
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user){
            return res.status(404).json({message:"user not found"});
        }
        res.status(200).json({message:"user deleted successfully"});

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

/**
 * @swagger
 * /users/signUp:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       500:
 *         description: Server error
 */
const createUser = async (req, res)=>{
    try{
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json(newUser);
    }catch(error){
        res.status(500).json({message: error.message});
    }
}


/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
const LogInUser = async (req, res)=>{
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
          return res.status(400).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
        // Generate a JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
        // Send the token back to the client
        res.json({ token });
    
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error, please try again later' });
      }
}

/**
 * @swagger
 * /users/{id}/posts:
 *   get:
 *     summary: Get posts of a user
 *     description: Retrieve posts of a specific user if the profile is public or the current user follows them.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       200:
 *         description: A list of the user's posts.
 *       403:
 *         description: Access to posts is restricted.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
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


/**
 * @swagger
 * /users/search:
 *   get:
 *     summary: Search for users by username
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: username
 *         required: true
 *         description: Username to search for
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of matching users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   username:
 *                     type: string
 *                   email:
 *                     type: string
 *       404:
 *         description: No users found
 *       500:
 *         description: Server error
 */
const searchUsers = async (req, res) => {
    try {
      const { username } = req.query;
      if (!username) {
        return res.status(400).json({ message: 'Please provide a username to search' });
      }
  
      // Use a regular expression to search for similar usernames (partial match)
      const regex = new RegExp(username, 'i'); // 'i' makes the search case-insensitive
  
      // Find users where the username contains the search term
      const users = await User.find({ username: regex });

      if (users.length === 0) {
        return res.status(404).json({ message: 'No users found matching your search criteria' });
      }
      res.status(200).json(users);
    } catch (error) {
      // Handle any errors
      res.status(500).json({ message: error.message });
    }
  };
  

  /**
 * @swagger
 * /users/follow/{id}:
 *   post:
 *     summary: Follow a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to follow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow request sent successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Already following or private account
 *       500:
 *         description: Server error
 */
const followUser = async (req, res)=>{
    try {
        const currentUser = await User.findById(req.user.id);
        const userToFollow = await User.findById(req.params.id);
    
        if (!userToFollow) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if already following
        if (currentUser.following.includes(userToFollow._id)) {
          return res.status(400).json({ error: 'You are already following this user' });
        }
    
        if (userToFollow.isPrivate) {
          // If the profile is private, add to pending requests
          userToFollow.pendingRequests.push(currentUser._id);
          await userToFollow.save();
          return res.json({ message: `Follow request sent to ${userToFollow.username}` });
        }
    
        // If the profile is public, follow directly
        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);
        
        await currentUser.save();
        await userToFollow.save();
    
        res.json({ message: `You are now following ${userToFollow.username}` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

/**
 * @swagger
 * /users/acceptFollow/{id}:
 *   post:
 *     summary: Accept a follow request
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Follower's User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow request accepted successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: No follow request from this user
 *       500:
 *         description: Server error
 */
const acceptFollow = async (req, res)=>{
    try {
        const currentUser = await User.findById(req.user.id);
        const followerToAccept = await User.findById(req.params.id);
    
        if (!followerToAccept) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if this user actually requested to follow
        if (!currentUser.pendingRequests.includes(followerToAccept._id)) {
          return res.status(400).json({ error: 'No follow request from this user' });
        }
    
        // Add to followers and following
        currentUser.followers.push(followerToAccept._id);
        followerToAccept.following.push(currentUser._id);
    
        // Remove from pending requests
        currentUser.pendingRequests = currentUser.pendingRequests.filter(userId => userId.toString() !== followerToAccept._id.toString());
    
        await currentUser.save();
        await followerToAccept.save();
    
        res.json({ message: `You have accepted ${followerToAccept.username}'s follow request` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}

/**
 * @swagger
 * /users/rejectFollow/{id}:
 *   delete:
 *     summary: Reject a follow request
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Follower's User ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Follow request rejected successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: No follow request from this user
 *       500:
 *         description: Server error
 */
const rejectFollow = async (req, res)=>{
    try {
        const currentUser = await User.findById(req.user.id);
        const followerToReject = await User.findById(req.params.id);
    
        if (!followerToReject) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if this user actually requested to follow
        if (!currentUser.pendingRequests.includes(followerToReject._id)) {
          return res.status(400).json({ error: 'No follow request from this user' });
        }
    
        // Remove from pending requests
        currentUser.pendingRequests = currentUser.pendingRequests.filter(userId => userId.toString() !== followerToReject._id.toString());
    
        await currentUser.save();
    
        res.json({ message: `You have rejected ${followerToReject.username}'s follow request` });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
}



/**
 * @swagger
 * /users/unfollow/{id}:
 *   delete:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID to unfollow
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *       404:
 *         description: User not found
 *       400:
 *         description: Not following this user
 *       500:
 *         description: Server error
 */const unfollowUser = async (req, res)=>{
    try {
        const currentUser = await User.findById(req.user.id);
        const userToUnfollow = await User.findById(req.params.id);
    
        if (!userToUnfollow) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Check if already following
        if (!currentUser.following.includes(userToUnfollow._id)) {
          return res.status(400).json({ error: 'You are not following this user' });
        }
    
        // Remove from following list
        currentUser.following = currentUser.following.filter(userId => userId.toString() !== userToUnfollow._id.toString());
        
        // Remove from followers list of the user being unfollowed
        userToUnfollow.followers = userToUnfollow.followers.filter(userId => userId.toString() !== currentUser._id.toString());
    
        await currentUser.save();
        await userToUnfollow.save();
    
        res.json({ message: `You have unfollowed ${userToUnfollow.username}` });
      } catch (err) {
        res.status(500).json({ error: err.message });
    }
}



module.exports = {
    getUser,
    updateUser,
    deleteUser,
    createUser,
    followUser,
    unfollowUser,
    acceptFollow,
    rejectFollow,
    LogInUser,
    searchUsers,
    getUserPosts
}