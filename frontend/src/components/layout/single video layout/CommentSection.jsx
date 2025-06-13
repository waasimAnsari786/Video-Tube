import React, { useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import { FiSend } from "react-icons/fi";
import { Avatar, useImagePreview } from "../../../index";

const CommentSection = ({ customClass = "" }) => {
  const { getPreview } = useImagePreview();
  const avatar = getPreview("avatar");

  const [input, setInput] = useState("");
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Dev Journey",
      avatar: (
        <Avatar avatar="https://randomuser.me/api/portraits/women/65.jpg" />
      ),
      content: "Awesome video! Really helpful for beginners. 🔥",
      time: "1 hour ago",
    },
    {
      id: 2,
      author: "Code Master",
      avatar: (
        <Avatar avatar="https://randomuser.me/api/portraits/men/42.jpg" />
      ),
      content: "This UI is so clean! Loving the Tailwind usage.",
      time: "3 hours ago",
    },
  ]);

  const handlePost = () => {
    if (!input.trim()) return;
    const newComment = {
      id: Date.now(),
      author: "You",
      avatar: <FaRegUserCircle className="text-2xl text-gray-500" />,
      content: input.trim(),
      time: "Just now",
    };
    setComments([newComment, ...comments]);
    setInput("");
  };

  return (
    <div
      className={`bg-[var(--my-blue-transparent)] p-4 rounded-xl mt-4 mb-2 ${customClass}`}
    >
      <h2 className="text-[var(--my-blue)] font-semibold text-lg mb-3">
        Comments
      </h2>

      <div className="flex gap-2 mb-10">
        <Avatar avatar={avatar} />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border-b border-gray-300 focus:outline-none focus:border-[var(--my-blue)] text-sm py-1"
        />
        <button onClick={handlePost} className="cursor-pointer">
          <FiSend color="#132977" />
        </button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-sm text-gray-500">No comments yet.</p>
        ) : (
          comments.map(({ id, author, content, avatar, time }) => (
            <div key={id}>
              <div className="flex items-start gap-2">
                <div>{avatar}</div>
                <div>
                  <p className="text-sm font-semibold text-[var(--my-blue)]">
                    {author}{" "}
                    <span className="text-xs text-gray-400">• {time}</span>
                  </p>
                  <p className="text-sm text-gray-700">{content}</p>
                </div>
              </div>
              <hr className="border-t border-gray-300 my-2" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
