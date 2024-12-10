const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const songListDiv = document.getElementById('song-list');
    const audioPlayer = document.getElementById('audio-player');
    const currentSongEl = document.getElementById('current-song');
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarProgressBar = document.getElementById('sidebar-progress-bar');
    const sidebarCurrentTime = document.getElementById('current-time');
    const sidebarTotalTime = document.getElementById('total-time');

    const progressBar = document.getElementById('progress-bar');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const loopBtn = document.getElementById('loop-btn');

    let songs = [];
    let currentSongIndex = 0;
    let isShuffling = false;
    let isLooping = false;

    // Fetch and display songs
    fetch(`${API_URL}/songs`)
        .then(response => response.json())
        .then(data => {
            songs = data;
            songs.forEach((song, index) => {
                const songDiv = document.createElement('div');
                songDiv.classList.add('song');
                songDiv.textContent = song;

                // Play song on click
                songDiv.addEventListener('click', () => playSong(index));

                songListDiv.appendChild(songDiv);
            });
        })
        .catch(err => console.error('Error fetching songs:', err));

    // Play a specific song
    const playSong = (index) => {
        currentSongIndex = index;
        audioPlayer.src = `${API_URL}/songs/${songs[currentSongIndex]}`;
        currentSongEl.textContent = songs[currentSongIndex];
        audioPlayer.play();

        updateActiveSong();
        updatePlayPauseButton();
        sidebar.classList.add('visible');
    };

    // Update the active song's border
    const updateActiveSong = () => {
        const songDivs = document.querySelectorAll('.song');
        songDivs.forEach((div, i) => {
            if (i === currentSongIndex) {
                div.classList.add('active');
            } else {
                div.classList.remove('active');
            }
        });
    };

    // Play or Pause
    playPauseBtn.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
        updatePlayPauseButton();
    });

    // Update Play/Pause Button
    const updatePlayPauseButton = () => {
        playPauseBtn.textContent = audioPlayer.paused ? '▶️' : '⏸️';
    };

    // Next Song
    nextBtn.addEventListener('click', () => {
        if (isShuffling) {
            playSong(Math.floor(Math.random() * songs.length));
        } else {
            playSong((currentSongIndex + 1) % songs.length);
        }
    });

    // Previous Song
    prevBtn.addEventListener('click', () => {
        if (audioPlayer.currentTime > 5) {
            audioPlayer.currentTime = 0; // Restart the current song
        } else {
            playSong((currentSongIndex - 1 + songs.length) % songs.length);
        }
    });

    // Shuffle Toggle
    shuffleBtn.addEventListener('click', () => {
        isShuffling = !isShuffling;
        shuffleBtn.style.color = isShuffling ? '#ff5733' : '#fff'; // Highlight active shuffle
    });

    // Loop Toggle
    loopBtn.addEventListener('click', () => {
        isLooping = !isLooping;
        audioPlayer.loop = isLooping; // Enable/disable audio looping
        loopBtn.style.color = isLooping ? '#ff5733' : '#fff'; // Highlight active loop
    });

    // Update Progress Bar
    audioPlayer.addEventListener('timeupdate', () => {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        if (duration) {
            const progress = (currentTime / duration) * 100;
            progressBar.value = progress;
            sidebarProgressBar.value = progress;

            // Update times
            sidebarCurrentTime.textContent = formatTime(currentTime);
            sidebarTotalTime.textContent = formatTime(duration);
        }
    });

    // Seek Progress
    progressBar.addEventListener('input', () => {
        const newTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    sidebarProgressBar.addEventListener('input', () => {
        const newTime = (sidebarProgressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    // Format time in MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' + secs : secs}`;
    };

    // Automatically Play Next Song
    audioPlayer.addEventListener('ended', () => {
        if (isLooping) {
            audioPlayer.play(); // Repeat the current song
        } else if (isShuffling) {
            playSong(Math.floor(Math.random() * songs.length));
        } else {
            playSong((currentSongIndex + 1) % songs.length);
        }
    });

    // Close sidebar
    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('visible');
    });
});
