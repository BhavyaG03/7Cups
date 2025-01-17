import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ForumPage() {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/forum/posts');
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
    <div>
      <h2>Forum</h2>
      <form onSubmit={createPost}>
        <textarea
          placeholder="Share your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <br/>
        <button type="submit">Post</button>
      </form>
      <hr/>
      <div>
        {posts.map((post) => (
          <div key={post._id} style={{ marginBottom: '1rem' }}>
            <p><strong>{post.userId?.username}:</strong> {post.content}</p>
            <small>Posted on: {new Date(post.createdAt).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForumPage;
