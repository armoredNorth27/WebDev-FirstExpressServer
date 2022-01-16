//Name: Alex Nedev
//Student ID: 101195595

// ***************************************************************************************************** //
// *                                            Create Router                                          * //
// ***************************************************************************************************** //

const express = require('express');
const router = express.Router();

router.get('/', sendAllRestaurants);
router.post('/', createRestaurant);
router.param('restID', findRestaurant);
router.get('/:restID', sendRestaurant);
router.put('/:restID', updateRestaurant);

// ***************************************************************************************************** //
// *                                           Router Responses                                        * //
// ***************************************************************************************************** //

//? Sends all restaurants in either html or json format
function sendAllRestaurants(req, res){
    res.format({
        'text/html': () => {
            res.set('Content-Type', 'text/html');
            res.render('restaurants', { allRestaurants: req.app.locals.restaurants });
        },
        'application/json': () => {
            restIDs = [];
            let length = Object.keys(req.app.locals.restaurants).length;
            for(let i=0; i<length; i++){
                restIDs.push(req.app.locals.restaurants[i].id);
            }

            res.set('Content-Type', 'application/json');
            res.json({"restaurants": restIDs});
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

//? Creates a new restaurant based off the given data
function createRestaurant(req, res){

    res.format({
        'application/json': () => {
            let newRestInfo = req.body;
            const deliveryFeeIsFloat = parseFloat(newRestInfo.delivery_fee);
            const minOrderIsFloat = parseFloat(newRestInfo.min_order);
        
            // Check that all fields in the restaurant are filled and valid
            if( newRestInfo.name && deliveryFeeIsFloat != NaN && minOrderIsFloat != NaN && parseFloat(newRestInfo.delivery_fee)>=0 && parseFloat(newRestInfo.min_order)>=0 ){
                req.app.locals.restaurantID++;
                let restaurant = {
                    "id": req.app.locals.restaurantID,
                    "name": newRestInfo.name, 
                    "min_order": parseFloat(newRestInfo.min_order), 
                    "delivery_fee": parseFloat(newRestInfo.delivery_fee),
                    "menu" : {}
                };
                req.app.locals.restaurants[req.app.locals.restaurantID] = restaurant;
        
                res.status(201).send(JSON.stringify(restaurant));
            }
            else{
                res.status(400).send("Invalid request. Please fill all fields and make sure delivery fee and minimum order are positive numbers.");
            }
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });

}

//? Finds the ID of the restaurant that's being requested
function findRestaurant(req, res, next, value){
    // Stores the restaurant with the specified ID for router-wide use
    req.restaurant = req.app.locals.restaurants[value];

    // Deals with invalid restaurant requests
    if(!req.restaurant){
        return res.status(404).send('That restaurant does not exist.');
    }

    next();
}

//? Send 1 specific restaurant in either html or json format
function sendRestaurant(req, res){
    res.format({
        'text/html': () => {
            res.set('Content-Type', 'text/html');
            res.render('singleRestaurant', { singleRest: req.restaurant });
        },
        'application/json': () => {
            res.set('Content-Type', 'application/json');
            res.json(req.restaurant);
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

function updateRestaurant(req, res){
    res.format({
        'application/json': () => {
            let allRestIDs = Object.keys(req.app.locals.restaurants);

            if(req.body.id in allRestIDs){
                req.app.locals.restaurants[req.body.id] = req.body;

                res.set('Content-Type', 'text/plain');
                res.send("");
            }
            else{
                res.set('Content-Type', 'text/plain');
                res.status(404).send("Restaurant not found");
            }
        },
        'default': () => { res.status(406).send('Not acceptable'); }
    });
}

// ***************************************************************************************************** //
// *                                            Export Router                                          * //
// ***************************************************************************************************** //

module.exports = router;