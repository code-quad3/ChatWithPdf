import { useState } from "react";
import axios from "axios";
import "./App.css";
import { SendHorizonal } from "lucide-react";
import ChatMessage from "./components/ChatMessage";
import BlurredCard from "./components/BlurredCard";

function App() {
  // State to control modal visibility
  const [open, setOpen] = useState(false);

  // State to store chat messages
  const [messages, setMessages] = useState([]);

  // Input value of the chat box
  const [input, setInput] = useState("");

  // To show loader on send button
  const [loading, setLoading] = useState(false);

  // Currently hardcoded user ID
  const currentUserId = "123";

  // Handle send button click
  const handleSend = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    // Create user message object
    const newUserMsg = {
      _id: Date.now(), // unique id
      senderId: currentUserId,
      receiverId: "pdf-server",
      name: "You",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      message: input,
      status: "Sent",
    };

    // Display the user's message
    setMessages((prev) => [...prev, newUserMsg]);
    setInput(""); // Clear input field
    setLoading(true); // Show loader

    try {
      // Send user question to backend
      const apilUrl = import.meta.env.VITE_API_URL;
      const res = await axios.post("apiUrl/ask", {
        question: input,
      });

      // Create server (bot) response message
      const serverMsg = {
        _id: Date.now() + 1,
        senderId: "pdf-server",
        receiverId: currentUserId,
        name: "Bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        message: res.data.answer || "No reply",
        status: "Delivered",
      };

      // Display bot response
      setMessages((prev) => [...prev, serverMsg]);
    } catch (err) {
      // On error, display error message
      const errorMsg = {
        _id: Date.now() + 2,
        senderId: "pdf-server",
        receiverId: currentUserId,
        name: "Bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        message: "Something went wrong. Please try again.",
        status: "Error",
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  return (
    <>
      {/* Navbar */}
      <div className="w-full h-10 bg-gray-150 text-black-400 flex items-center justify-between px-4">
        <p className="text-lg">ChatWithPdf</p>

        {/* Upload Button */}
        <button
          onClick={() => setOpen(true)} // Open upload modal
          className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 text-sm text-white"
        >
          {/* Upload Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4 mr-1.5"
          >
            <path
              fillRule="evenodd"
              d="M10.5 3.75a6 6 0 0 0-5.98 6.496A5.25 5.25 0 0 0 6.75 20.25H18a4.5 4.5 0 0 0 2.206-8.423 3.75 3.75 0 0 0-4.133-4.303A6.001 6.001 0 0 0 10.5 3.75Zm2.03 5.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72v4.94a.75.75 0 0 0 1.5 0v-4.94l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3Z"
              clipRule="evenodd"
            />
          </svg>
          Upload Files
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="w-full h-[calc(100vh-6rem)] overflow-auto  p-4 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={
                msg.senderId === currentUserId
                  ? "md:col-start-2 flex justify-end" // Show sender messages on right
                  : "md:col-start-1" // Show bot messages on left
              }
            >
              <ChatMessage
                name={msg.name}
                time={msg.time}
                message={msg.message}
                status={msg.status}
                isSender={msg.senderId === currentUserId}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Input and Send Button */}
      <div className="w-[80%] mx-auto p-2 flex items-center gap-2">
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:border-pink-600 block w-full ps-10 p-2.5"
          placeholder="Send a Message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSend}
          className="text-white bg-black rounded-sm p-1"
          disabled={loading} // Disable button while waiting for response
        >
          <SendHorizonal className="h-full w-8" />
        </button>
      </div>

      {/* PDF Upload Modal */}
      {open && <BlurredCard onClose={() => setOpen(false)} />}
    </>
  );
}

export default App;
