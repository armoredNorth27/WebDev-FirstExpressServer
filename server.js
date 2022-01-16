//Name: Alex Nedev
//Student ID: 101195595

// ***************************************************************************************************** //
// *                                         Initialize data                                           * //
// ***************************************************************************************************** //

const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3000;
const restaurantRouter = require('./restaurant-router');

// Set "Global" variables. Allows the router to use these as well
app.locals.restaurants = {};
app.locals.restaurantID;

// ***************************************************************************************************** //
// *                                          Setup Middleware                                         * //
// ***************************************************************************************************** //

app.set(path.join(__dirname, 'A3')); // Set the folder that app will be using
app.set('view engine', 'pug'); // Set template engine to use pug
app.use(express.static(path.join(__dirname, 'restaurants'))); // Serve restaurant objects
app.use(express.static(path.join(__dirname, 'views'))); // Serve files in views folder
app.use(express.static(path.join(__dirname, 'javascript'))); // Serve javascript files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Parse request body if it is JSON
app.use(express.urlencoded({extended: true})); // Parse form data
app.use((req, res, next) => { // Print request information
    console.log( `${req.method}: ${req.url}` );
    if(Object.keys(req.body).length > 0){
        console.log('Body: ');
        console.log(req.body);
    }
    next();
});

// ***************************************************************************************************** //
// *                                            Server Routes                                          * //
// ***************************************************************************************************** //


//? Handles all requests that involve /restaurants
app.use('/restaurants', restaurantRouter);

//? Handles home page get request
app.get(['/', '/index', '/home'], (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'views/HTML/index.html'));
});
//? Handles addrestaurant page get request
app.get('/addrestaurant', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname, 'views/HTML/addRestaurant.html'));
});

//? Serve client.js file when it's requested
app.get('/client.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.send('client.js');
});

//? Deals with invalid requests
app.use( (req, res) => {
    res.status(404).send('404 not found');
});

// ***************************************************************************************************** //
// *                                        Connect to 'Database'                                      * //
// ***************************************************************************************************** //

//? Records all existing restaurants in the restaurants folder
fs.readdir('./restaurants/', (err, files) => {
    if(err) return console.log(err);

    // Adds restaurants in the database to the server
    for(let i=0; i<files.length; i++){
        let restaurant = require('./restaurants/' + files[i]);
        app.locals.restaurantID = restaurant.id;

        app.locals.restaurants[app.locals.restaurantID++] = restaurant;
    }

    // Start Server
    app.listen(PORT);
    console.log(`Server listening at http://localhost:${PORT}`);
});
