import React, { useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import { useAuth } from "../../context/AuthContext";
import { usePost } from "../../context/PostContext";

const CreatePost = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [postImage, setPostImage] = useState(null); // Store image file
  const [imagePreview, setImagePreview] = useState(null); // Store image preview URL
  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const { accessToken } = useAuth();
  const { setPosts, posts, error, setError } = usePost();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPostImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (postImage) {
      formData.append("image", postImage);
    }

    try {
      const response = await axios.post(
        "https://postapp01.vercel.app/api/post",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      setPosts([...posts, response.data]);
      setDescription("");
      setTitle("");
      setPostImage(null);
      setImagePreview(null);
      setError(null);
      toggleModal();
    } catch (err) {
      setError("Failed to create post");
    }
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="px-4 py-2 font-semibold  text-white transition duration-300 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
      >
        + Create Post
      </button>

      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <form
          onSubmit={handleSubmit}
          className="p-4 "
          encType="multipart/form-data"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create New Post
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Image
            </label>
            <input
              type="file"
              onChange={handleImageChange}
              className="w-full px-3 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              accept="image/*"
            />
          </div>

          {imagePreview && (
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                Image Preview:
              </p>
              <img
                src={imagePreview}
                alt="Post Preview"
                className="w-full h-48 object-cover rounded-md shadow-md"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2 mt-4 font-semibold text-white transition duration-300 bg-gradient-to-r from-green-500 to-green-700 rounded-md shadow-md hover:from-green-600 hover:to-green-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
          >
            Submit
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default CreatePost;
