const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Endpoint to get the list of songs
app.get('/songs', (req, res) => {
    const songsFolder = path.join(__dirname, 'songs');
    fs.readdir(songsFolder, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch songs' });
        }
        const songs = files.filter(file => file.endsWith('.mp3'));
        res.json(songs);
    });
});

// Endpoint to serve a song
app.get('/songs/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'songs', filename);
    res.sendFile(filePath);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Backend is working!');
});
