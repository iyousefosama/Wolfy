const express = require('express');

const server = () => {
    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.listen(10000, () => {
        console.log('Server is running on port 10000');
    });
}

module.exports = server;