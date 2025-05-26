import { useState } from "react";
import axios from "axios";
import FileUploader from "./FileUploader";

// Modal component for uploading PDF files
export default function BlurredCard({ onClose }) {
  // State to store the selected file
  const [selectedFile, setSelectedFile] = useState(null);

  // State to hold error messages
  const [error, setError] = useState("");

  // State to track upload progress percentage (null = hidden)
  const [uploadProgress, setUploadProgress] = useState(null);

  // Function to handle file upload
  const handleFileSubmit = async () => {
    setError(""); // Clear any previous errors

    // If no file is selected, show an error
    if (!selectedFile) {
      setError("Please upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile); // Append the selected file to the form data

    try {
      // Send POST request to backend API for file upload
      const response = await axios.post(
        "http://172.17.240.1:8000/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            // Calculate percentage of file uploaded
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted); // Update progress bar
          },
        }
      );

      console.log("Upload success:", response.data);

      // Reset upload progress and optionally close modal
      setUploadProgress(null);
      // You can call onClose() here if you want to auto-close modal after upload
    } catch (err) {
      setError("Upload failed. Please try again."); // Display error
      console.error(err);
      setUploadProgress(null);
    }
  };

  return (
    // Background blur and overlay
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm"
      onClick={onClose} // Close modal on clicking outside
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the box
      >
        <h2 className="text-xl font-semibold mb-2">Upload Your PDF</h2>
        <p className="mb-4 text-sm text-gray-600">Only pdf is allowed</p>

        {/* FileUploader component */}
        <div className="flex flex-col items-center mb-4 w-full">
          <FileUploader
            onFileSelect={setSelectedFile}
            onError={setError}
          />

          {/* Error message */}
          {error && (
            <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
          )}

          {/* Upload progress bar */}
          {uploadProgress !== null && (
            <div className="w-full mt-4 bg-gray-200 rounded-full dark:bg-gray-700">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>

          {/* Save/Upload button */}
          <button
            onClick={handleFileSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
