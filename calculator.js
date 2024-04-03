const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

const windowSize = 10;
let storedNumbers = [];

async function fetchNumberFromServer(numberId) {
    try {
        const response = await axios.get(`http://testserver.com/numbers/${numberId}`);
        return response.data.number;
    } catch (error) {
        console.error(`Error fetching number for ID ${numberId}: ${error.message}`);
        return null;
    }
}

function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, curr) => acc + curr, 0);
    return sum / numbers.length;
}

app.get('/numbers/:numberId', async (req, res) => {
    const { numberId } = req.params;

    const number = await fetchNumberFromServer(numberId);

    if (number !== null) {
        if (!storedNumbers.includes(number)) {
            storedNumbers.push(number);
            if (storedNumbers.length > windowSize) {
                storedNumbers.shift(); // Remove the oldest number
            }
        }

        const beforeNumbers = [...storedNumbers];
        const afterNumbers = [...storedNumbers];
        const average = storedNumbers.length >= windowSize ? calculateAverage(storedNumbers) : null;

        res.json({
            beforeNumbers,
            afterNumbers,
            average
        });
    } else {
        res.status(500).json({ error: 'Failed to fetch number' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
