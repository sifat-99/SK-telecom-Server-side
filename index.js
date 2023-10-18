const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5001;

// middleware

app.use(cors());
app.use(express.json());

// routes

app.get('/', (req, res) => {
    res.send('testing!');
    });

    


// listen

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    });