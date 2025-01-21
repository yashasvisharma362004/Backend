const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();


app.use((req, res, next) => {
    const logFilePath = path.join(__dirname, 'index.txt');


    const logData = `
    Timestamp: ${new Date().toISOString()}
    IP Address: ${req.ip}
    URL: ${req.originalUrl}
    Protocol: ${req.protocol}
    HTTP Method: ${req.method}
    Hostname: ${req.hostname}
    `;

    fs.appendFile(logFilePath, logData, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });

    console.log(logData);
    next();
});

app.get('/', (req, res) => {
    res.send('Welcome to the Express.js logging app!');
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost: 3000`);
});
