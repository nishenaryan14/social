import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const picturePath = req.file ? req.file.location : ""; // Handle file URL from multer-s3

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Create new post
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath, // Save the URL of the uploaded picture
      likes: {},
      comments: [],
    });
    await newPost.save();

    // Retrieve all posts sorted by createdAt in descending order to return
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(201).json(posts);
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ message: err.message });
  }
};

/* READ */
// export const getFeedPosts = async (req, res) => {
//   try {
//     // Retrieve all posts sorted by createdAt in descending order
//     const posts = await Post.find().sort({ createdAt: -1 });
//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(404).json({ message: err.message });
//   }
// };

export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user contains the authenticated user's ID
    const user = await User.findById(userId);

    // Include the user's own posts and their friends' posts
    const friendIds = user.friends;

    // Find posts where the `userId` matches the current user or any of their friends
    const posts = await Post.find({
      userId: { $in: [userId, ...friendIds] },
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    // Retrieve posts by specific user sorted by createdAt in descending order
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Assuming req.user contains the authenticated user's ID

    // Find the post by ID
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the current user is the post owner or an admin
    if (post.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    // Delete the post
    await Post.findByIdAndDelete(id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in deletePost:", err);
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE */
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({ message: "Post not found" });

    const isLiked = post.likes.get(userId);

    if (isLiked) {
      post.likes.delete(userId);
    } else {
      post.likes.set(userId, true);
    }

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/*COMMENTS*/
export const addComment = async (req, res) => {
  const { id: postId } = req.params;
  const { userId, comment } = req.body;

  try {
    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    post.comments.push({
      userId,
      text: comment,
      userName: `${user.firstName} ${user.lastName}`,
    });
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in addComment:", error);
    res.status(500).json({ message: error.message });
  }
};
