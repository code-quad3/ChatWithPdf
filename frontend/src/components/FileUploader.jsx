import { useRef } from "react";
import uploadIcon from "../assets/svg/upload.svg";

// FileUploader component handles file upload via drag & drop or manual selection
const FileUploader = ({ onFileSelect, onError }) => {
  // useRef gives access to the hidden file input element
  const fileInputRef = useRef(null);

  // Triggered when a file is selected manually
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  // Triggered when a file is dropped into the dropzone
  const handleDrop = (event) => {
    event.preventDefault(); // Prevent default browser behavior (e.g., opening file)
    const file = event.dataTransfer.files[0];
    processFile(file);
  };

  // Validates and processes the selected file
  const processFile = (file) => {
    if (!file) return;

    const extension = file.name.split(".").pop().toLowerCase();
    if (extension !== "pdf") {
      onError("Only PDF files are allowed"); // Show error for invalid file types
      return;
    }

    onError(""); // Clear previous error if any
    onFileSelect(file); // Pass the valid file to the parent component
  };

  // When user clicks the "Upload PDF" button, trigger the hidden input click
  const handleCustomButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className="min-h-[23rem] border-4 border-dashed border-black bg-gray-100 rounded-3xl p-4 flex flex-col justify-center items-center space-y-4 w-full"
      onDragOver={(e) => e.preventDefault()} // Enable drag-over behavior
      onDrop={handleDrop} // Handle drop event
    >
      {/* Upload icon */}
      <img src={uploadIcon} alt="Upload Icon" className="w-24 h-24 mb-2" />

      {/* UI messages */}
      <p className="text-lg font-semibold">Drag and Drop the file</p>
      <p className="text-lg font-bold">or</p>

      {/* Button to trigger file input */}
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Upload PDF
      </button>

      {/* Hidden file input (triggered by button click) */}
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploader;

