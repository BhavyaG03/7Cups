import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ForumPage() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const apiUrl=import.meta.env.VITE_API_URL

  const fetchPosts = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/forum/posts');
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post');
      return;
    }
    try {
      await axios.post(
        'http://localhost:5000/api/forum/post',
        { content },
        { headers: { 'x-auth-token': token } }
      );
      setContent('');
      fetchPosts(); // Refresh the list of posts
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500">
      <div className="max-w-4xl p-8 mx-auto space-y-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-600">
          Forum
        </h2>
        <form onSubmit={createPost} className="space-y-4">
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            rows="4"
          />
          <button
            type="submit"
            className="w-full py-3 font-semibold text-white transition-all duration-300 transform rounded-lg bg-gradient-to-r from-blue-500 to-teal-400 hover:scale-105"
          >
            Post
          </button>
        </form>
        <hr className="my-4 border-gray-300" />
        <div className="space-y-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className="p-6 transition-all rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100"
            >
              <p className="text-lg font-semibold text-gray-800">
                <strong>{post.userId?.username}:</strong> {post.content}
              </p>
              <small className="block mt-2 text-red-500">
                Posted on: {new Date(post.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ForumPage;
