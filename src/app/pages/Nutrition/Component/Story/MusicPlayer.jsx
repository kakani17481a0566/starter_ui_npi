import { useState, useRef, useEffect } from 'react';
import './MusicPlayer.css';
import { playlistData } from './data';

const MusicPlayer = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(1); // Default: State Lines
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [parsedLyrics, setParsedLyrics] = useState([]);

  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const requestRef = useRef(); // Stores the animation frame ID

  const currentSong = playlistData.songs[currentSongIndex];

  // --- 1. HIGH SPEED TIMER LOOP ---
  // Standard onTimeUpdate is too slow for word-sync. We use requestAnimationFrame.
  const animate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isPlaying]);


  // --- 2. FETCH AND PARSE LYRICS ---
  useEffect(() => {
    setParsedLyrics([]);
    setIsPlaying(false); // Pause when changing songs

    if (currentSong.json) {
      fetch(currentSong.json)
        .then(res => res.json())
        .then(data => {
          const lyrics = data.lyrics || [];

          const processed = lyrics.map((lineObj, index) => {
            const startTime = lineObj.time / 1000;
            // If next line exists, that's our end time. Otherwise, add 5s.
            const nextLineTime = lyrics[index + 1] ? (lyrics[index + 1].time / 1000) : startTime + 5;
            const lineDuration = nextLineTime - startTime;

            return {
              text: lineObj.line,
              words: lineObj.line.split(" "), // Split line into array of words
              startTime: startTime,
              endTime: nextLineTime,
              duration: lineDuration,
              // Calculate time per word (Assumption: Equal timing per word)
              timePerWord: lineDuration / lineObj.line.split(" ").length
            };
          });
          setParsedLyrics(processed);
        })
        .catch(err => console.error("Lyrics error:", err));
    }
  }, [currentSongIndex]);


  // --- 3. AUTO-SCROLL LOGIC ---
  useEffect(() => {
    // Find the active line element
    const activeLineEl = document.querySelector('.lyric-line.current-line');
    if (activeLineEl && lyricsContainerRef.current) {
        // Calculate position to scroll it to the center
        const container = lyricsContainerRef.current;
        const scrollOffset = activeLineEl.offsetTop - container.offsetTop - (container.clientHeight / 2) + (activeLineEl.clientHeight / 2);

        container.scrollTo({
            top: scrollOffset,
            behavior: 'smooth'
        });
    }
  }, [currentTime]);


  // --- CONTROLS ---
  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) audio.pause();
    else audio.play();
    setIsPlaying(!isPlaying);
  };

  const handleLoadedMetadata = () => setDuration(audioRef.current.duration);

  const handleProgressClick = (e) => {
    const newTime = (e.nativeEvent.offsetX / e.currentTarget.offsetWidth) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const nextSong = () => setCurrentSongIndex((prev) => (prev + 1) % playlistData.songs.length);
  const prevSong = () => setCurrentSongIndex((prev) => prev === 0 ? playlistData.songs.length - 1 : prev - 1);
  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m < 10 ? "0"+m : m}:${s < 10 ? "0"+s : s}`;
  };

  return (
    <div className="main-container">
      <audio
        ref={audioRef}
        src={currentSong.audio}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={nextSong}
      />

      {/* LYRICS */}
      <div className="lyrics-section">
        <div className="song-info-header">
          <h1>{currentSong.song}</h1>
          <h3>{currentSong.author}</h3>
        </div>

        <div className="lyrics-content" ref={lyricsContainerRef}>
          {parsedLyrics.map((line, i) => {
            // Is the song currently within this line's time window?
            const isCurrentLine = currentTime >= line.startTime && currentTime < line.endTime;

            return (
              <div key={i} className={`lyric-line ${isCurrentLine ? 'current-line' : ''}`}>
                {line.words.map((word, j) => {
                  // --- WORD HIGHLIGHT LOGIC ---
                  // 1. Calculate exactly when THIS word starts and ends
                  const wordStartTime = line.startTime + (j * line.timePerWord);
                  const wordEndTime = wordStartTime + line.timePerWord;

                  const isWordSung = currentTime > wordEndTime; // Past tense
                  const isWordActive = currentTime >= wordStartTime && currentTime <= wordEndTime; // Present tense

                  return (
                    <span
                        key={j}
                        className={`word ${isWordSung ? 'sung' : ''} ${isWordActive ? 'active-word' : ''}`}
                    >
                      {word}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* PLAYER CARD */}
      <div className="player-section">
        <div className="player-card">
          <div className="album-cover">
            <img src={currentSong.albumart} alt="Album Art" />
          </div>

          <div className="progress-area">
            <span>{formatTime(currentTime)}</span>
            <div className="progress-bar-bg" onClick={handleProgressClick}>
              <div className="progress-fill" style={{ width: `${(currentTime / duration) * 100}%` }}>
                <div className="progress-knob"></div>
              </div>
            </div>
            <span>{formatTime(duration)}</span>
          </div>

          <div className="song-title-sm">{currentSong.song}</div>

          <div className="controls">
            <i className="fas fa-redo control-icon"></i>
            <i className="fas fa-step-backward control-icon" onClick={prevSong}></i>
            <div className="play-btn" onClick={togglePlay}>
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
            </div>
            <i className="fas fa-step-forward control-icon" onClick={nextSong}></i>
            <i className="fas fa-random control-icon"></i>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <div className="bottom-ui">
        <div className="nav-bar">
          <div className="nav-item"><i className="fas fa-tv"></i></div>
          <div className="nav-item"><i className="fas fa-gamepad"></i></div>
          <div className="nav-item"><i className="fas fa-book"></i></div>
          <div className="nav-item"><i className="fas fa-microphone-alt"></i></div>
          <div className="nav-item active"><i className="fas fa-music"></i></div>
        </div>
        <button className="next-btn" onClick={nextSong}>Next</button>
      </div>
    </div>
  );
};

export default MusicPlayer;