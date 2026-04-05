require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;

// ROUTE 1 - Homepage: fetch all Trip records and render homepage
app.get('/', async (req, res) => {
    const tripsUrl = 'https://api.hubapi.com/crm/v3/objects/2-60123316';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    const params = {
        properties: 'trip_name,countries_to_visi,trip_budget,trip_category'
    };

    try {
        const resp = await axios.get(tripsUrl, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Trips | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching trips from HubSpot.');
    }
});

// ROUTE 2 - Show form to create a new Trip record
app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | HubSpot APIs' });
});

// ROUTE 3 - Handle form submission, create new Trip record, redirect to homepage
app.post('/update-cobj', async (req, res) => {
    const { trip_name, countries_to_visi, trip_budget, trip_category } = req.body;

    const newTrip = {
        properties: {
            trip_name,
            countries_to_visi,
            trip_budget,
            trip_category
        }
    };

    const createUrl = 'https://api.hubapi.com/crm/v3/objects/2-60123316';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createUrl, newTrip, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating trip in HubSpot.');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
