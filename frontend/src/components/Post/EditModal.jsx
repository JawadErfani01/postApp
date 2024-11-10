import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

Modal.setAppElement("#root");

const EditModal = ({ isOpen, onRequestClose, post, onUpdate }) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const { accessToken } = useAuth();

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `https://postappapi.vercel.app/api/post/${post._id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      onUpdate(response.data); // Update post list with the new data
      onRequestClose();
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Post"
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 p-4"
    >
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Edit Post</h2>
        <input
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />
        <textarea
          className="w-full mb-4 p-2 border border-gray-300 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows="5"
        />
        <div className="flex justify-end space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onRequestClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleUpdate}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditModal;
