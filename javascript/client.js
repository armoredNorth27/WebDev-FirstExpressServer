//Name: Alex Nedev
//Student ID: 101195595

// ***************************************************************************************************** //
// *                                       addRestaurant elements                                      * //
// ***************************************************************************************************** //

const restName = document.getElementById('addRestName');
const deliveryFee = document.getElementById('addDeliveryFee');
const minOrder = document.getElementById('addMinOrder');

// ***************************************************************************************************** //
// *                                      singleRestaurant elements                                    * //
// ***************************************************************************************************** //

const newRestName = document.getElementById('pugRestName');
const newDeliveryFee = document.getElementById('pugDeliveryFee');
const newMinOrder = document.getElementById('pugMinOrder');
const newCategoryInputBox = document.getElementById('newCategory');
const menu = document.getElementById('menu');
const selectionBox = document.getElementById('selectCategory');
const newName = document.getElementById('newName');
const newDescription = document.getElementById('newDescription');
const newPrice = document.getElementById('newPrice');

// ***************************************************************************************************** //
// *                                          Client Responses                                         * //
// ***************************************************************************************************** //

//? GET the ID's of all the restaurants
function getRestIDs(){
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){
            const response = JSON.parse(xhttp.response);
            console.log(response);
            console.log("All restaurants recieved");
        }
        else if(this.readyState===4 && this.status===406){
            alert(xhttp.response);
        }
    };
    
    xhttp.open("GET", "/restaurants", true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
    
}

//? GET request that gets json representation of the specified restaurant
function getRestAtID(restID){
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){
            const response = JSON.parse(xhttp.response);
            console.log(response);
            console.log("Restaurant data recieved");
        }
        else if(this.readyState===4 && this.status===406){
            alert(xhttp.response);
        }
    };
    
    xhttp.open("GET", `/restaurants/${restID}`, true);
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();
    
}

//? POST the data for the new restaurant and redirect the user to it
function postData(){

    let newRestObj = {
        "name": restName.value,
        "delivery_fee": deliveryFee.value,
        "min_order": minOrder.value
    };
    console.log(newRestObj);
    
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===201){
            const response = JSON.parse(xhttp.response);
            
            //? Reset the values inside the text fields
            restName.value = '';
            deliveryFee.value = '';
            minOrder.value = '';
            
            window.location.assign(`/restaurants/${response.id}`);
        }
        else if(this.readyState===4 && this.status===400){
            alert(xhttp.response);
        }
        else if(this.readyState===4 && this.status===406){
            alert(xhttp.response);
        }
        
    };
    
    xhttp.open("POST", "/restaurants", true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newRestObj));
    
}

//? PUT request that updates the current restaurant on the server
function updateRestaurant(){

    updateBasicInfo();

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState===4 && this.status===200){
            const response = xhttp.response;

            if(!response){
                alert("Changes saved.");
            }
        }
        else if(this.readyState===4 && this.status===406){
            alert(xhttp.response);
        }
        else if(this.readyState===4 && this.status===404){
            console.log("Restaurant not found");
        }
    };

    xhttp.open("PUT", `/restaurants/${object.id}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(object));
    
}

//? Updates the restaurant name, delivery fee and minimum order as needed
function updateBasicInfo(){

    const newDeliveryFeeIsFloat = parseFloat(newDeliveryFee.value);
    const newMinOrderIsFloat = parseFloat(newMinOrder.value);

    // Checks that the new name isn't empty
    if( newRestName.value ){
        object.name = newRestName.value;
    }
    else{
        alert("Name won't be updated. Cannot assign the restaurant an empty name.");
    }

    // Checks that the delivery fee is a positive number
    if( newDeliveryFeeIsFloat != NaN && parseFloat(newDeliveryFee.value)>=0 ){
        object.delivery_fee = newDeliveryFee.value;
    }
    else{
        alert("Delivery fee won't be updated. It needs to be a positive number.");
    }

    // Checks that the delivery fee is a positive number
    if( newMinOrderIsFloat != NaN && parseFloat(newMinOrder.value)>=0 ){
        object.min_order = newMinOrder.value;
    }
    else{
        alert("Minimum order won't be updated. It must be a positive number.");
    }

}

//? Adds a new category to the restaurant through DOM
function addCategory(){

    // Ensures no duplicate or empty categories are added
    if(newCategoryInputBox.value in object.menu || newCategoryInputBox.value == ""){
        alert("That category either exists or is empty. Please enter a unique name for this new category.");
    }
    
    // Adds category
    else{
        object.menu[newCategoryInputBox.value] = {};

        // Creates a div that holds the new category
        const newDiv = document.createElement('div');
        newDiv.id = newCategoryInputBox.value;
        console.log(newDiv.id);

        // Creates new category title in the menu
        const newCategory = document.createElement('h3');
        newCategory.innerHTML = newCategoryInputBox.value;
        newCategory.className = "subLabels";
        
        // Add the div and title to the webpage
        newDiv.append(newCategory);
        menu.append(newDiv);

        // Creates new option in the select box for adding a new item
        const newOption = document.createElement('option');
        newOption.innerHTML = newCategoryInputBox.value;
        selectionBox.append(newOption);
    }
    
}

//? Adds a new item for the specified category through DOM
function addItem(){
    
    const newPriceIsFloat = parseFloat(newPrice.value);
    
    // Ensures there exists a value for every field. Also makes sure the price is a float
    if( newName.value && newDescription.value && newPriceIsFloat != NaN && newPriceIsFloat>0 ){
        const selectedCategory = document.getElementById(selectionBox.value);
        let highestID = -1;
        
        //? Finds the highest item ID out of all the items in the selected restaurant
        let allKeys = Object.keys(object.menu);
        let allKeysLength = allKeys.length;
        // Iterate through all categories in the restaurant
        for(let i=0; i<allKeysLength; i++){
            
            let allItems = Object.keys(object.menu[allKeys[i]]);
            let allItemsLength = allItems.length;
            // Iterate through all IDs of the items of each category
            for(let j=0; j<allItemsLength; j++){
                if(highestID < parseInt(allItems[j])){
                    highestID = parseInt(allItems[j]);
                }
            }

        }
        highestID += 1;
        
        //? Add new item to the menu
        let newItem = {
            'name': newName.value,
            'description': newDescription.value,
            'price': newPrice.value
        };
        object.menu[selectedCategory.id][highestID] = newItem;

        //? Update the DOM with the new item
        const nameAndPrice = document.createElement('p');
        nameAndPrice.innerHTML = newName.value + " ($" + newPrice.value + ")";

        const description = document.createElement('p');
        description.innerHTML = newDescription.value;

        const br = document.createElement('br');

        selectedCategory.append(nameAndPrice, description, br);

        //? Reset the item fields
        newName.value = '';
        newDescription.value = '';
        newPrice.value = '';
    }

    else{
        alert("Please enter something for the field of every item! Also make sure the price is a positive number.");
    }
    
}