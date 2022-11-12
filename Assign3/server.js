const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
app.engine(".hbs", handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// setup a 'route' to listen on the default url path
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/home.html"));
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "/login.html"));
});

app.post("/login", (req, res) => {
    var userInfo = {
        user: req.body.username,
        pass: req.body.password,
        expression: /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(req.body.username)
    }

    if (userInfo.user == "" || userInfo.pass == "") {

        res.render("login", { data: userInfo, layout: false });
        return;
    }

    if (userInfo.expression) {
        res.render("login", { data: userInfo, layout: false });
        return;
    }

    res.render("dashboard", { layout: false });

});

// app.get("/login", function (req,res) {
//     var userInfo = {
//         fname: "Quyen",
//         lname: "Do",
//         position:"student"
//     };
    
//     res.render("login", { data: userInfo, layout: false });
// });

app.get("/registration", function (req, res) {
    res.sendFile(path.join(__dirname, "/registration/registration.html"));
});

//Router function for 'registration' page
app.post("/registration", (req, res) => {

    var userInfo = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        city: req.body.city,
        phonetest: /^\d{10}$/.test(req.body.phonenumber),
        Address: req.body.Address,
        zipcode: req.body.zipcode,
        country: req.body.country,
        password: req.body.password,
        passwordtest: /^[0-9a-zA-Z]{6,12}$/.test(req.body.password),
    }

    checkpass = () => {
        if (userInfo.password == userInfo.confirmpassword) {
            return true;
        }
        return false;
    }

    userInfo.checkpassword = checkpass;

    if (userInfo.fname == "" ||
        userInfo.lname == "" ||
        userInfo.email == "" ||
        userInfo.phonenumber == "" ||
        userInfo.Address1 == "" ||
        userInfo.city == "" ||
        userInfo.postalcode == "" ||
        userInfo.country == "" ||
        userInfo.password == "" ||
        userInfo.confirmpassword == "") {

        res.render("registration", { data: userInfo, layout: false });
        return;
    }

    if (!userInfo.phonetest) {
        res.render("registration", { data: userInfo, layout: false });
        return;
    }
    if (!userInfo.postaltest) {
        res.render("registration", { data: userInfo, layout: false });
        return;
    }
    if (!userInfo.passwordtest) {
        res.render("registration", { data: userInfo, layout: false });
        return;
    }
    if (!userInfo.checkpassword) {
        res.render("registration", { data: userInfo, layout: false });
        return;
    }

    res.render("dashboard", { layout: false });

});

app.listen(HTTP_PORT);