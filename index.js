const volumeWarningModal = document.getElementById("volume-warning");
const okBtn = document.getElementById("ok-btn");
const cancelBtn = document.getElementById("cancel-btn");

function showModal() {
  volumeWarningModal.style.display = "flex";
}

function hideModal() {
  volumeWarningModal.style.display = "none";
}

// Event listener for OK button
okBtn.addEventListener("click", function () {
  hideModal();
  localStorage.setItem("volumeWarningAccepted", "true"); // Store acceptance in local storage
  music.volume = volumeSlider.value;
  volumePercentage.textContent = `${Math.round(music.volume * 100)}%`;
  previousVolume = music.volume; // Store the previous volume
  updateVolumeIcon(music.volume);
});

// Event listener for Cancel button
cancelBtn.addEventListener("click", function () {
  hideModal();
  volumeSlider.value = previousVolume;
  music.volume = previousVolume;
  volumePercentage.textContent = `${Math.round(previousVolume * 100)}%`;
  updateVolumeIcon(previousVolume);
});

const image = document.getElementById("cover"),
  title = document.getElementById("music-title"),
  artist = document.getElementById("music-artist"),
  currentTimeEl = document.getElementById("current-time"),
  durationEl = document.getElementById("duration"),
  progress = document.getElementById("progress"),
  playerProgress = document.getElementById("player-progress"),
  volumeBtn = document.getElementById("volume"),
  volumeSliderContainer = document.getElementById("volume-slider-container"),
  volumeSlider = document.getElementById("volume-slider"),
  volumePercentage = document.getElementById("volume-percentage"),
  prevBtn = document.getElementById("prev"),
  nextBtn = document.getElementById("next"),
  playBtn = document.getElementById("play"),
  repeatBtn = document.getElementById("repeat"),
  background = document.getElementById("bg-img");

const music = new Audio();

const songs = [
  {
    path: "assets/Skyrim Camp.mp3",
    displayName: "Skyrim Camp",
    cover: "assets/traveller.PNG",
    artist: "J Soule",
  },
  {
    path: "assets/Skyrim Gathering.mp3",
    displayName: "Skyrim Gathering",
    cover: "assets/traveller0.PNG",
    artist: "J Soule",
  },
  {
    path: "assets/Skyim Ebony Warrior.mp3",
    displayName: "The Ebony Warrior of Skyrim",
    cover: "assets/traveller1.PNG",
    artist: "J Soule",
  },
];

let musicIndex = 0;
let isPlaying = false;
let volumeTimeout;
let isMuted = false;
let isRepeating = false;
let previousVolume = 0.5; // Set initial previous volume to 50%

function togglePlay() {
  if (isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

function playMusic() {
  isPlaying = true;
  playBtn.classList.replace("fa-play", "fa-pause");
  playBtn.setAttribute("title", "Pause");
  music.play();
}

function pauseMusic() {
  isPlaying = false;
  playBtn.classList.replace("fa-pause", "fa-play");
  playBtn.setAttribute("title", "Play");
  music.pause();
}

function loadMusic(song) {
  music.src = song.path;
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  image.src = song.cover;
  background.src = song.cover;

  // Set volume to the last used volume
  music.volume = previousVolume;
  volumeSlider.value = previousVolume;
  volumePercentage.textContent = `${Math.round(previousVolume * 100)}%`;
  updateVolumeIcon(previousVolume);
}

function changeMusic(direction) {
  musicIndex = (musicIndex + direction + songs.length) % songs.length;
  loadMusic(songs[musicIndex]);
  playMusic();
}

function updateProgressBar() {
  if (isPlaying) {
    const duration = music.duration;
    const currentTime = music.currentTime;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, "0");

    const minutes = formatTime(Math.floor(currentTime / 60));
    const seconds = formatTime(Math.floor(currentTime % 60));
    currentTimeEl.textContent = `${minutes}:${seconds}`;

    const durationMinutes = formatTime(Math.floor(duration / 60));
    const durationSeconds = formatTime(Math.floor(duration % 60));
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}

function setProgressBar(e) {
  const width = playerProgress.clientWidth;
  const clickX = e.offsetX;
  const duration = music.duration;
  music.currentTime = (clickX / width) * duration;
}

function changeVolume(e) {
  const volume = e.target.value;
  if (volume > 0.5 && !localStorage.getItem("volumeWarningAccepted")) {
    showModal();
  } else {
    music.volume = volume;
    volumePercentage.textContent = `${Math.round(volume * 100)}%`;
    updateVolumeIcon(volume); // Update volume icon when volume changes
    previousVolume = volume; // Store the previous volume
    if (volume === 0) {
      isMuted = true;
    } else {
      isMuted = false;
    }
  }
}

function toggleMute() {
  if (isMuted) {
    // If muted and volume was 0, set to 50%
    if (previousVolume == 0) {
      previousVolume = 0.5;
    }
    music.volume = previousVolume;
    volumeSlider.value = previousVolume;
    volumePercentage.textContent = `${Math.round(previousVolume * 100)}%`;
    updateVolumeIcon(previousVolume); // Update volume icon when unmuting
    isMuted = false;
  } else {
    previousVolume = music.volume;
    music.volume = 0;
    volumeSlider.value = 0;
    volumePercentage.textContent = "0%";
    updateVolumeIcon(0); // Update volume icon when muting
    isMuted = true;
  }

  // Show volume slider container
  volumeSliderContainer.classList.add("active");
  stopHideVolumeSlider(); // Stop hide timeout
}

function hideVolumeSlider() {
  volumeTimeout = setTimeout(() => {
    volumeSliderContainer.classList.remove("active");
  }, 2000);
}

function stopHideVolumeSlider() {
  clearTimeout(volumeTimeout);
}

function toggleRepeat() {
  isRepeating = !isRepeating;
  repeatBtn.classList.toggle("active", isRepeating);
  music.loop = isRepeating;
}

// Event listener for the repeat button
repeatBtn.addEventListener("click", toggleRepeat);

// Update volume icon based on volume level
function updateVolumeIcon(volume) {
  if (volume == 0) {
    volumeBtn.classList.replace("fa-volume-low", "fa-volume-xmark");
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-xmark");
  } else if (volume == 1) {
    volumeBtn.classList.replace("fa-volume-low", "fa-volume-high");
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-high");
  } else {
    volumeBtn.classList.replace("fa-volume-xmark", "fa-volume-low");
    volumeBtn.classList.replace("fa-volume-high", "fa-volume-low");
  }
}

// Event listeners
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", () => changeMusic(-1));
nextBtn.addEventListener("click", () => changeMusic(1));
music.addEventListener("ended", () => changeMusic(1));
music.addEventListener("timeupdate", updateProgressBar);
playerProgress.addEventListener("click", setProgressBar);
volumeBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", changeVolume);
volumeSliderContainer.addEventListener("mouseenter", stopHideVolumeSlider);
volumeSliderContainer.addEventListener("mouseleave", hideVolumeSlider);
repeatBtn.addEventListener("click", toggleRepeat);

// Load the first song
loadMusic(songs[musicIndex]);

// Add beat visualizer elements
const beatVisualizer = document.createElement("div");
beatVisualizer.classList.add("beat-visualizer");
document.body.appendChild(beatVisualizer);

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const source = audioCtx.createMediaElementSource(music);
source.connect(analyser);
analyser.connect(audioCtx.destination);
analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

// Function to visualize the beat
function visualizeBeat() {
  requestAnimationFrame(visualizeBeat);

  analyser.getByteFrequencyData(dataArray);
  const maxValue = Math.max(...dataArray);

  // Adjust the threshold based on your audio file characteristics
  if (maxValue > 150) {
    beatVisualizer.classList.add("active");
    document.getElementById("music-container").classList.add("neon-glow");
  } else {
    beatVisualizer.classList.remove("active");
    document.getElementById("music-container").classList.remove("neon-glow");
  }
}

// Event listeners to handle play and pause
music.addEventListener("play", () => {
  audioCtx.resume().then(() => {
    visualizeBeat();
  });
});

music.addEventListener("pause", () => {
  beatVisualizer.classList.remove("active");
  document.getElementById("music-container").classList.remove("neon-glow");
});
