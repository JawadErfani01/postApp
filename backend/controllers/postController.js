import Post from "../models/postModel.js";

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name email profileImage");

    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "user",
      "name email profileImage"
    );

    if (!post) {
      return res.status(404).json({ message: "No posts found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a specific user's posts
const getUserPost = async (req, res) => {
  const userId = req.userId; // Ensure this is correctly set in your authentication middleware

  try {
    // Find posts and populate the user field with the user's details
    const posts = await Post.find({ user: userId }).populate(
      "user",
      "name email"
    );

    // Check if posts are empty
    if (posts.length === 0) {
      return res.status(404).json({ message: "You don't have any posts yet!" });
    }

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// create post
const createPost = async (req, res) => {
  const { title, description } = req.body;
  // Check if the file is uploaded
  const postImage = req.file ? req.file.path : null;

  if (!title || !description) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const newPost = await Post.create({
      title,
      description,
      user: req.userId, // Ensure this is set by middleware
      postImage,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Update a post
const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update this post" });
    }

    // Update post details
    post.title = title || post.title;
    post.description = description || post.description;

    const updatedPost = await post.save();
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Delete a post
const deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the post in a single step
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

export { getPosts, getUserPost, getPost, createPost, updatePost, deletePost };
