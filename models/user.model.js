const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        required: true 
    },

    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // People following this user
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  // People this user is following
    isPrivate: { type: Boolean, default: false }, // True if the profile is private
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Users requesting to follow
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
    createdAt: { type: Date, default: Date.now }
}
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
