const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const app = express();

const HTTP_PORT = process.env.PORT || 8080;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//password: 5HzSRN48RUT1R72h
const registration = mongoose.createConnection("mongodb+srv://admin:5HzSRN48RUT1R72h@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");
const blog = mongoose.createConnection("mongodb+srv://admin:5HzSRN48RUT1R72h@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");
const read = mongoose.createConnection("mongodb+srv://admin:5HzSRN48RUT1R72h@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");

const registration_schema = new Schema({
    "fname": String,
    "lname": String,
    "email": String,
    "business": String,
    "street": String,
    "zipcode": String,
    "place": String,
    "country": String,
    "password" : {
        "type": String,
        "unique": true
    }
});

const blog_schema = new Schema({
    "title": String,
    "description": String
});

const student = registration.model("registration", registration_schema);
const smallblog = blog.model("blog_web", blog_schema)

app.use(bodyParser.urlencoded({ extended: true }));

// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
  }
  
app.engine(".hbs", handlebars.engine({ extname: '.hbs' }));
app.set('view engine', '.hbs');

// setup a 'route' to listen on the default url path
app.get("/", function(req, res){
    smallblog.findOne().exec().then((data) => {
        console.log(data);
        res.render("blog", {
            title: data.title, 
            description: data.description,
            layout: false
        });
    });
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "/blog.html"));
});

app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, "/login/login.html"));
});

app.post("/login", (req, res) => {
    var userInfo = {
        user: req.body.username,
        pass: req.body.password,
        express: /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(req.body.username)
    }

    if (userInfo.user == "" || userInfo.pass == "") {

        res.render("login", { data: userInfo, layout: false });
        return;
    }

    if (userInfo.express) {
        res.render("login", { data: userInfo, layout: false });
        return;
    }

    student.findOne({ username: userInfo.user, password: userInfo.pass }, ["fname", "lname", "username"]).exec().then((data) => {
        if (data) {
            if (data.id == "6366c66a9afb45a8af4a82c4") {
                res.render("dashboard", { fname: data.fname, lname: data.lname, username: data.username, layout: false });
                return;
            }
            else {
                res.render("login_dashboard", { fname: data.fname, lname: data.lname, username: data.username, layout: false });
                return;
            }
        } else {
            res.render("login", { error: "Sorry, you entered wrong username and password", layout: false });
            return;
        }
    });
});

app.get("/registration", function (req, res) {
    res.sendFile(path.join(__dirname, "/registration/registration.html"));
});

//Router function for 'registration' page
app.post("/registration", (req, res) => {
    var userInfo = {
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        business: req.body.business,
        street: req.body.street,
        zipcode: req.body.zipcode,
        place: req.body.place,
        country: req.body.country,
        phonenumber: req.body.phonenumber,
        phonetest: /^\d{10}$/.test(req.body.phonenumber),
        password: req.body.password,
        passwordtest: /^[0-9a-zA-Z]{6,12}$/.test(req.body.password),
        confirmPassword: req.body.confirmPassword,
    }

    var checkpass = () => {
        if (userInfo.password == userInfo.confirmPassword) {
            return true;
        }
        return false;
    }

    userInfo.checkPassword = checkpass;

    if (userInfo.fname == "" ||
        userInfo.lname == "" ||
        userInfo.email == "" ||
        userInfo.business == "" ||
        userInfo.street == "" ||
        userInfo.zipcode == "" ||
        userInfo.place == "" ||
        userInfo.country == "" ||
        userInfo.phonenumber == "" ||
        userInfo.password == "" ) 
        {
        res.render("registration", { data: userInfo, layout: false });
        return;
    }

    if (!userInfo.phonetest) {
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
    else {
        res.render("dashboard", {layout: false});
    }

    var studentName = "";
    for (let index = 0; index < userInfo.email.length; index++) {
        const element = userInfo.email[index];
        if (element != '@') {
            username += element
        }
        if (element == '@') {
            break;
        }
    }
    let c1 = new student({
        fname: userInfo.fname,
        lname: userInfo.lname,
        email: userInfo.email,
        username: username,
        business: userInfo.business,
        street: userInfo.street,
        zipcode: userInfo.zipcode,
        place: userInfo.place,
        country: userInfo.country,
        phonenumber: userInfo.phonenumber,
        password: userInfo.password
    }).save((e, data) => {
        if (e) {
            console.log(e);
        } else {
            console.log(data);
        }
    });
    res.render("dashboard", { layout: false });

});

app.listen(HTTP_PORT);