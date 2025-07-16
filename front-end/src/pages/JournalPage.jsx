import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const moodOptions = [
  { label: '😊', value: 'happy' },
  { label: '😐', value: 'neutral' },
  { label: '😔', value: 'sad' },
  { label: '😣', value: 'anxious' },
  { label: '😴', value: 'tired' },
];

const entryImages = [
  '/j1.png',
  '/j2.png',
  '/j3.png',
];

const placeholderStyle = `
  textarea::placeholder {
    text-align: left;
    vertical-align: top;
  }
`;

const JournalPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const user = useSelector((state) => state.user.user);
  const userId = user?.user?.id;
  const [prompt, setPrompt] = useState('What are you grateful for today?');
  const [text, setText] = useState('');
  const [mood, setMood] = useState('happy');
  const [loading, setLoading] = useState(false);
  const [pastEntries, setPastEntries] = useState([]);

  // Fetch past entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/journal`, { params: { userId } });
        setPastEntries(res.data);
      } catch (err) {
        setPastEntries([]);
      }
    };
    if (userId) fetchEntries();
  }, [apiUrl, userId]);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !userId) return;
    setLoading(true);
    try {
      await axios.post(
        `${apiUrl}/api/journal`,
        { userId, text, mood, prompt, date: new Date().toISOString().slice(0, 10) }
      );
      setText('');
      // Refresh entries
      const res = await axios.get(`${apiUrl}/api/journal`, { params: { userId } });
      setPastEntries(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Could not save entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{placeholderStyle}</style>
      <div className="flex flex-col w-full max-w-[430px] mx-auto px-4 py-8 gap-8 min-h-screen bg-white" style={{ fontFamily: 'Epilogue, sans-serif' }}>
        {/* Prompt */}
        <div className="text-left w-full flex flex-col gap-4">
          <div className="font-bold text-lg mb-0">Today's Prompt</div>
          <div className="text-slate-700 font-regular mb-0">{prompt}</div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <textarea
              className="w-full min-h-[110px] rounded-2xl text-[#1b140e] border border-gray-[#e7dbd0] pt-3 pl-3 text-lg focus:outline-[#e7dbd0] resize-none bg-[#fcfaf8] mb-0"
              placeholder="Write your thoughts here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              maxLength={1000}
              style={{ fontSize: '1.1rem' }}
            />
            <div className="flex justify-end w-full">
              <button
                type="submit"
                className="px-7 py-2 rounded-full bg-[#EB9642] text-[#1b140e] font-bold text-base"
                disabled={loading || !text.trim()}
                style={{ letterSpacing: '0.2px' }}
              >
                {loading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
        {/* Mood */}
        <div className="flex flex-col gap-3 mt-8">
          <div className="font-bold text-lg mb-0">Mood</div>
          <div className="flex flex-row gap-4">
            {moodOptions.map((m) => (
              <button
                type="button"
                key={m.value}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center text-3xl transition-all shadow-sm ${mood === m.value ? 'bg-amber-100 border-amber-400' : 'bg-white border-gray-200'}`}
                onClick={() => setMood(m.value)}
                aria-label={m.value}
                disabled={loading}
                style={{ fontSize: '2rem' }}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        {/* Past Entries */}
        <div className="w-full flex flex-col gap-4 mt-8">
          <div className="font-bold text-lg mb-0">Past Entries</div>
          <div className="flex flex-col gap-6">
            {pastEntries.length === 0 && (
              <div className="text-gray-400 text-center text-base">No past entries yet.</div>
            )}
            {pastEntries.slice(0, 3).map((entry, idx) => (
              <div key={entry._id || idx} className="rounded-2xl overflow-hidden shadow-md border border-gray-100 bg-amber-50">
                <img
                  src={entryImages[idx % entryImages.length]}
                  alt="journal entry visual"
                  className="w-full h-48 object-cover"
                  style={{ background: '#e9dcc9' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default JournalPage;