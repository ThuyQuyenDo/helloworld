const exp = require("express");
const app = exp();
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");

const HTTP_PORT = process.env.PORT || 8080;

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
app.engine(".hbs", handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

//Router function for '/' page
app.get("/", function(req,res){
    res.render("home", {layout : false});
});

app.get("/login", function (req,res) {
    var userInfo = {
        fname: "Quyen",
        lname: "Do",
        position:"student"
    };
    
    res.render("login", { data: userInfo, layout: false });
});


// app.get("/", function(req, res){
//     res.sendFile(path.join(__dirname, "/home.html"));
// });

//req.query
// app.get("/view", function (req, res) {
//     var search = req.query.search;
//     if(search){
//         res.render("/login",{ search: search, layout: false});
//     }else{
//         res.render("home",{ error:"Please enter other username", 
//         layout: false });
//     }

//     console.log("You entered " + search);
//     res.send("You entered " + search);
// });

//Router function for 'registration' page
app.get("/registration", function(req,res){
    res.render("registration", {layout : false});
});



app.listen(HTTP_PORT, onHttpStart);