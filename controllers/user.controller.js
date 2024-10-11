const User = require("../models/user.model.js")
const getUser = async (req, res)=>{
    try{
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);

    }catch(error){
        res.status(500).json({message: error.message});
    }
}

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


const unfollowUser = async (req, res)=>{
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
    searchUsers
}