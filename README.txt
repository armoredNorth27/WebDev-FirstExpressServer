Purpose of Project:
	This project is meant to be a restaurant ordering webpage that incorporates a client-server
architecture. The server is created using express, but there is no database software that is used in
order to store data.

Design Decisions:

- The javascript code is split up into 3 main files; client.js, server.js, and restaurant-router.js.
The idea is that the client.js file deals with all necessary operations on the client side. The server
acts as the main central hub that stores all of the restaurants and it directs the user to the different
routes that they want to take. The restaurant-router contains many different requests that find go through
the /restaurants path. Because there were a lot of requests that use this path, I decided to make a
separate file to contain the code for the appropriate responses. It helped to clean things up and make the
code much more legible.

client.js notes: The client.js file is primarily meant to be used to deal with the webpages that show all
the details for a selected restaurant. It allows the storage of a temporary, local, version of the selected
restaurant. The reason why this is done like this, is so that the changes that are made on the website 
won't actually update until the client/user decides that they want to. Once they press the save button to
save their changes, then this local, modified copy of the selected restaurant is sent to the server, where
it overrides the code of the original restaurant with this new local copy. It also has some helper functions
and such to help make the process of updating the local and absolute version of the selected restaurant. The
last thing the client.js file does, is that it allows for the creation of new restaurants. Methods are called
inside of this file in order to start the process of making a new restaurant. Once that new restaurant is made
and saved on the server, it redirects the user to the newly made restaurant page.

server.js notes: This file is the central hub that connects everything. It's primarily role is 2-fold. First
off, it's meant to store any and all restaurants in the restaurants folder. This will allow for some pre-
generated restaurants before anything is done. The 2nd function of the server.js file is to address any 
route direction and redirection. The server itself handles requests towards the home page and the add-
restaurant page. Additionally, the server serves any static files that may be necessary in the operation
of the website.

restaurant-router.js notes: This is the final javascript file, and it's sole purpose is to handle all requests
with the /restaurants route. This includes get, post and put requests. On top of that, it'll server different
responses based off of the content-type that's being requested. Some of the routes support both html and json
response data. All routes in the router have a default route that will be used incase some other request is
made that is not supported. All of them respond with a status of 406. The reason for this is simply because I
wanted to indicate to the user that their request is not an acceptable one.

Error Checking notes: I've added a good bit of error checking in this assignment. All text fields that are used
to add or update the status for a restaurant need to be filled with something in order to go through. My
reasoning behind this is that it doesn't really make sense for a restaurant object to exist without having a
name, delivery fee, and minimum order. So the user is either continually asked to enter data until it's valid,
or their request just won't be saved. The only time I don't save the data that the user has entered is when they're 
trying to update the name, delivery fee, and/or minimum order of the restaurant. If their updated values are invalid
then their request isn't saved in the server. Besides that I've also tried to ensure that only positive numbers
can be inputted for the delivery fee and minimum order.

HTML vs Pug: In this assignment I've used a mixture of pug and html. I've used HTML for both the home page and the
add restaurant page because both of those are static webpages, so I decided that HTML would be a good choice for
them. I also wanted to get some practice combining both ways of creating html into 1 project. For the page that
shows all restaurants and the webpage that shows each individual restaurant, I've used pug. This is because those
webpages are dynamically generated, so they change depending on what you add or update to each restaurant. As such,
it's easier to display these changes to the user using pug. I've also put all html related files into 1 folder so
that I can have an easier time serving the html in my server.

Installation/Running instructions:

1 - Navigate to the "assignment3" folder through your terminal/command prompt(You can use whichever one you prefer).

2 - Run the command "npm install" and wait for it to finish. This will download any necessary dependencies.

3 - Once the installation has completed, run the command "npm run start". This will start the server.

4 - Go to the following link "http://localhost:3000/"
