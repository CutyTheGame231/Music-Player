import React, { useState, useRef } from "react";
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import './styles/app.scss';
import data from './data'

function App() {
  const audioRef = useRef(null)

  const [songs, setSongs] = useState(data())
  const [currentSong, setCurrentSong] = useState(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
    animationPercentage: 0,
  })
  const [libraryStatus, setLibraryStatus] = useState(false)
  const timeUpdateHandler = (e) => {
    const current = e.target.currentTime
    const duration = e.target.duration
    const roundedCurrent = Math.round(current)
    const roundedDuration = Math.round(duration)
    const percentage = Math.round((roundedCurrent / roundedDuration) * 100)
    setSongInfo({ ...songInfo, currentTime: current, duration, animationPercentage: percentage })
  }
  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(songs[(currentIndex + 1) % songs.length])
    if (isPlaying) audioRef.current.play()

  }
  return (
    <div className={`App ${libraryStatus ? "library-active" : ""}`}>
      <Nav libraryStatus={libraryStatus}
        setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player setSongs={setSongs}
        setCurrentSong={setCurrentSong}
        songs={songs}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        audioRef={audioRef}
        setIsPlaying={setIsPlaying}
        isPlaying={isPlaying}
        currentSong={currentSong} />
      <Library libraryStatus={libraryStatus}
        setSongs={setSongs}
        isPlaying={isPlaying}
        audioRef={audioRef}
        songs={songs}
        setCurrentSong={setCurrentSong} />
      <audio onLoadedMetadata={timeUpdateHandler}
        onTimeUpdate={timeUpdateHandler}
        ref={audioRef} src={currentSong.audio}
        onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
