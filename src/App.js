import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Joanna');
  const [audioUrl, setAudioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);

  const MAX_CHARS = 3000;

  const voices = [
    { id: 'Joanna', name: 'Joanna (English)', description: 'Professional female voice with American accent' },
    { id: 'Matthew', name: 'Matthew (English)', description: 'Clear male voice with American accent' },
    { id: 'Lupe', name: 'Lupe (Spanish)', description: 'Warm female voice with Spanish accent' },
    { id: 'Hans', name: 'Hans (German)', description: 'Strong male voice with German accent' },
  ];

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    setText(inputText);
    setCharacterCount(inputText.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter some text to narrate');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'https://hccnofpsj9.execute-api.us-east-2.amazonaws.com/prod/generate-audio',
        { text, voice_id: voice },
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAudioUrl(response.data.audio_url);
    } catch (err) {
      setError('Failed to generate audio. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setCharacterCount(0);
    setAudioUrl('');
    setError('');
  };

  return (
    <div className={`flex-col min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8">
        <div className={`max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          
          {/* Header */}
          <div className={`p-6 flex justify-between items-center border-b ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-purple-700 text-white'}`}>
            <h1 className="text-3xl font-bold">Book Narrator</h1>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-purple-600 text-white'}`}
            >
              {isDarkMode ? '☀️' : '🌙'}

            </button>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Text Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enter Text:
                  </label>
                  <span className={`text-sm ${characterCount > MAX_CHARS * 0.8 ? 'text-red-500' : isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {characterCount} characters
                  </span>
                </div>
                <textarea
                  value={text}
                  onChange={handleTextChange}
                  rows="8"
                  className={`w-full p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 text-gray-900'}`}
                  placeholder="Enter your text here..."
                  required
                />
              </div>
              
              {/* Voice Selection */}
              <div>
                <label className={`block text-lg font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Voice:
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className={`w-full p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border border-gray-300 text-gray-900'}`}
                >
                  {voices.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
                    loading 
                      ? (isDarkMode ? 'bg-gray-600 text-gray-400' : 'bg-purple-300 text-white') 
                      : (isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white')
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : "Generate Audio"}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className={`px-6 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Clear
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                <p>{error}</p>
              </div>
            )}

            {/* Audio Player */}
            {audioUrl && (
              <div className={`mt-8 ${isDarkMode ? 'bg-gray-700 p-6 rounded-lg' : 'text-center'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-purple-700'}`}>Generated Audio</h2>
                
                <audio 
                  controls 
                  src={audioUrl} 
                  className={`w-full mb-4 ${isDarkMode ? 'bg-gray-800 rounded p-2' : ''}`}
                >
                  Your browser does not support the audio element.
                </audio>
                
                <a
                  href={audioUrl}
                  download="narration.mp3"
                  className={`inline-block py-2 px-6 rounded-lg font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  <span className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    Download Audio
                  </span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;