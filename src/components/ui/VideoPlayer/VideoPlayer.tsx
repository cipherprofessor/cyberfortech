'use client';
// src/components/ui/VideoPlayer/VideoPlayer.tsx

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipForward, SkipBack, X } from 'lucide-react';
import styles from './VideoPlayer.module.scss';

interface VideoPlayerProps {
  url: string;
  title?: string;
  autoPlay?: boolean;
  onComplete?: () => void;
  className?: string;
  onClose?: () => void;
}

export function VideoPlayer({ 
  url, 
  title, 
  autoPlay = false, 
  onComplete, 
  className = '',
  onClose
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract video ID from YouTube URL
  const getYouTubeID = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
  };

  const isYouTubeURL = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Handle video source based on URL type
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    
    if (!url) {
      setError('Video URL is required');
      setIsLoading(false);
      return;
    }
    
    if (isYouTubeURL(url)) {
      // YouTube videos will be handled via iframe
      setIsLoading(false);
    } else {
      // Direct video files
      if (videoRef.current) {
        videoRef.current.addEventListener('loadeddata', () => {
          setIsLoading(false);
        });
        
        videoRef.current.addEventListener('error', () => {
          setError('Failed to load video');
          setIsLoading(false);
        });
      }
    }
  }, [url]);

  // Handle play/pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
    showControls();
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    showControls();
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    setCurrentTime(videoRef.current.currentTime);
    
    if (videoRef.current.ended && onComplete) {
      onComplete();
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };

  // Handle seeking
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    showControls();
  };

  // Handle fullscreen
  const toggleFullScreen = () => {
    if (!playerRef.current) return;
    
    if (!isFullscreen) {
      if (playerRef.current.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
    showControls();
  };

  // Format time (seconds to MM:SS)
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle skip forward/backward
  const skip = (seconds: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime += seconds;
    setCurrentTime(videoRef.current.currentTime);
    showControls();
  };

  // Handle controls visibility
  const showControls = () => {
    setControlsVisible(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setControlsVisible(false);
      }
    }, 3000);
  };

  // Handle mouse movement to show controls
  const handleMouseMove = () => {
    showControls();
  };

  // Handle click on video to toggle play/pause
  const handleVideoClick = () => {
    togglePlay();
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!playerRef.current) return;
      
      // Only handle keydown events if the player is focused
      if (!playerRef.current.contains(document.activeElement)) return;
      
      switch (e.key) {
        case ' ':  // Space bar
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullScreen();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, isMuted, isFullscreen]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Render YouTube iframe or native video player
  if (isYouTubeURL(url)) {
    const youtubeId = getYouTubeID(url);
    
    return (
      <div className={`${styles.youtubeContainer} ${className}`}>
        {title && <h3 className={styles.videoTitle}>{title}</h3>}
        {isLoading && <div className={styles.loader}>Loading...</div>}
        {error && <div className={styles.error}>{error}</div>}
        
        {youtubeId && (
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${autoPlay ? 1 : 0}&rel=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Video player"}
            className={styles.youtubeEmbed}
          />
        )}
        
        {onClose && (
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close video"
          >
            <X size={20} />
          </button>
        )}
      </div>
    );
  }

  // Native video player
  return (
    <div 
      ref={playerRef}
      className={`${styles.videoPlayer} ${className} ${isFullscreen ? styles.fullscreen : ''}`}
      onMouseMove={handleMouseMove}
      tabIndex={0} // Make the container focusable for keyboard events
    >
      {title && <h3 className={styles.videoTitle}>{title}</h3>}
      {isLoading && <div className={styles.loader}>Loading...</div>}
      {error && <div className={styles.error}>{error}</div>}
      
      <video
        ref={videoRef}
        src={url}
        className={styles.video}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        autoPlay={autoPlay}
        onClick={handleVideoClick}
      />
      
      {onClose && (
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close video"
        >
          <X size={20} />
        </button>
      )}
      
      <div className={`${styles.controls} ${controlsVisible || !isPlaying ? styles.visible : ''}`}>
        <button 
          className={styles.playPauseButton} 
          onClick={togglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        
        <button 
          className={styles.skipButton} 
          onClick={() => skip(-10)}
          aria-label="Skip backward 10 seconds"
        >
          <SkipBack size={18} />
        </button>
        
        <div className={styles.progressContainer}>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className={styles.progressBar}
            aria-label="Video progress"
          />
          <div className={styles.timeDisplay}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        
        <button 
          className={styles.skipButton} 
          onClick={() => skip(10)}
          aria-label="Skip forward 10 seconds"
        >
          <SkipForward size={18} />
        </button>
        
        <button 
          className={styles.muteButton} 
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        
        <button 
          className={styles.fullscreenButton} 
          onClick={toggleFullScreen}
          aria-label="Toggle fullscreen"
        >
          <Maximize size={20} />
        </button>
      </div>
    </div>
  );
}