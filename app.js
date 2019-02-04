/* require necessary dependencies */

// require express
var express = require('express');
// require data.json file
const { projects } = require("./data.json");
// require json for section content
const index = require("./data/index.json");
const about = require("./data/about.json");

/* set up middleware */
var app = express();
// set view engine to pug
app.set("view engine", "pug");
// serve status files located in public folders
app.use("/static", express.static("public"));
// app should listen on port 3000
var port = 3000;

/* context object */

var context = {
  projects,
  index,
  about
};

/* set your routes */

// An "index" route (/) to render the "Home" page
app.get("/", (req, res) => {
  // locals set to data.projects
  res.locals.context = context;
  res.render("index", context);
});

// An "about" route (/about) to render the "About" page
app.get("/about", (req, res) => {
  res.locals.context = context;
  res.render("about", context);
});

// Dynamic "project" routes
app.get("/projects/:id", (req, res) => {
  /* based on the id of the project render a customized version of the Pug project template. That means adding data,
   or "locals", as an object that contains data to be passed to the Pug template */
  var project = projects[req.params.id-1];
  projectContext = {
    context,
    project
  };
  res.locals.projectContext = projectContext;
  // console.log('locals ',res.locals);
  res.render("project", projectContext);
});

// If the route requested does not exist show an error
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  console.log(`There was an error. (${err.message})`);
  next(err);
});

/* Handle errors */

/* If a user navigates to a non-existent route, or if a request for a resource fails for whatever reason, your app
 should handle the error in a user friendly way. */

app.use((err, req, res, next) => {
  /* Add an error handler to app.js that sets the error message to a user friendly message, and sets the status code. */
  res.locals.context = context;
  res.status(err.status);
  res.render("error", { err, context });
  /* see the error. pug file where the app logs out a user friendly message to the console when the app is pointed at
   a URL that doesnt exist as a route in the
   app, such as /error/error. */
});

// Listens to the port variable
app.listen(port, () => {
  /* log a string to the console that says which port the app is listening to */
  console.log(`The portfolio site is running at localhost:${port}`);
});