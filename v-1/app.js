const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let campgrounds = [
            {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7351/9756241141_0854983f93.jpg"},
            {name: "Granite Hill", image: "https://farm6.staticflickr.com/5222/5611578349_c47eae741a.jpg"},
            {name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5222/5611578349_c47eae741a.jpg"}
];

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    
    res.render("campgrounds", {campgrounds:campgrounds});
});

app.post("/campgrounds", function(req,res) {
    // Get data from form and add to campgrounds array
    // Reroute back to /campgrounds
    const name = req.body.name;
    const image = req.body.image;
    const newCampGround = {name: name, image: image};
    campgrounds.push(newCampGround);
    res.redirect("/campgrounds")
});

app.get("/campgrounds/new", function(req,res) {
   res.render("new.ejs") 
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has Started!");
});