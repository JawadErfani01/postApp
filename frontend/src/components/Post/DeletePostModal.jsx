import React, { useState } from "react";
import Modal from "react-modal";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../../utilities/axiosInstance";

Modal.setAppElement("#root");

const DeletePostModal = ({ postId, isOpen, onRequestClose, onDelete }) => {
  const { accessToken } = useAuth();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/post/${postId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      onDelete(postId); // Callback to remove the deleted post from the list
      onRequestClose(); // Close the modal
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Delete"
      className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 p-4"
    >
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm text-center">
        <h3 className="text-xl font-semibold mb-4">
          Are you sure you want to delete this post?
        </h3>
        <div className="flex justify-center space-x-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            onClick={onRequestClose} // Close the modal
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={handleDelete} // Confirm delete
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeletePostModal;
