import React from 'react';

function AudioPlayer({ audioUrl }) {
  return (
    <div className="audio-player">
      <h2>Generated Audio</h2>
      <audio controls src={audioUrl}>
        Your browser does not support the audio element.
      </audio>
      <a href={audioUrl} download="narration.mp3" className="download-link">
        Download Audio
      </a>
    </div>
  );
}

export default AudioPlayer;