import React, { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  audioBlob: Blob;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBlob }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Create audio URL from blob
    audioUrlRef.current = URL.createObjectURL(audioBlob);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrlRef.current;
    }

    // Cleanup function
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
    };
  }, [audioBlob]);

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        preload="metadata"
      />
      
      <button onClick={handlePlay} className="btn">
        {isPlaying ? '⏸️' : '▶️'}
      </button>
      
      <span style={{ fontSize: '0.9rem' }}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
};

export default AudioPlayer;
