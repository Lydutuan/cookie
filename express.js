const express = require('express');
const app = express();
const port = 3000;
const cookieParser = require('cookie-parser');

app.use(cookieParser());

app.get('/', (req, res) => {
    res.cookie('serverSession', 'abcdef', { maxAge: 48 * 60 * 60 * 1000 });
    res.send('Cookie has been set');
});
app.get('/get-cookie', (req, res) => {
    const userCookie = req.cookies.serverSession;
    if (userCookie) {
        res.send(`User cookie value: ${userCookie}`);
    } else {
        res.send('No user cookie found');
    }
});

app.get('/delete-cookie', (req, res) => {
    res.clearCookie('serverSession'); // Deleting the 'user' cookie
    res.send('Your cookies have been deleted');
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});