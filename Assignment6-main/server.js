const HTTP_PORT = process.env.PORT || 8080;
const express = require("express") 
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const handlebars = require("express-handlebars");
const mongoose = require("mongoose");
const clientSessions = require("client-sessions");
const bcrypt = require('bcryptjs');

//password: mIy52Rwwzil4jI46
const registration = mongoose.createConnection("mongodb+srv://tdo20:mIy52Rwwzil4jI46@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");
const blog = mongoose.createConnection("mongodb+srv://tdo20:mIy52Rwwzil4jI46@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");
const read = mongoose.createConnection("mongodb+srv://tdo20:mIy52Rwwzil4jI46@web322.uqo0pqp.mongodb.net/?retryWrites=true&w=majority");

const registration_schema = new mongoose.Schema({
    "firstName": String,
    "lastName": String,
    "username": { 
        "type": String, 
        "unique": true 
    },
    "password": String,
    "address": String,
    "dob": String,
    "phoneD": String,
    "course": String,
    "email": { 
        "type": String, 
        "unique": true 
    }
});

const blog_schema = new mongoose.Schema({
    "title": String,
    "date": String,
    "content": String,
    "image" : String
});

const userInfo = registration.model("registration", registration_schema);
const blogContent = blog.model("blog", blog_schema);


app.engine(".hbs", handlebars.engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.use(bodyParser.urlencoded({extended: true}));

app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "assignment_6_web322", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));


app.get("/", function(req, res) {
    blogContent.find().exec().then((data) =>{
        let blogData = new Array;
        data.forEach(element => {
            blogData.push({
                title: element.title,
                date: element.date,
                content: element.content,
                image: element.image
            });
        });
        res.render("blog", { 
            title: blogData, 
            layout: false
        });
    });
});

app.get("/view", function(req, res) {
    res.render("read_more", {layout: false});
});

app.post("/article", function(req, res) {
    blogContent.findOne({ title: req.body.title }).exec().then((data) =>{
        res.render("read_more", {
            id:data._id, 
            title:data.title, 
            content:data.content, 
            date:data.date, 
            image:data.image, 
            layout: false});
     });
});

app.post("/update", ensureLogin, (req, res) => {
    blogContent.updateOne({
        _id : req.body.updateID
    },{
        $set: {
        title: req.body.title,
        date : req.body.date,
        content: req.body.content,
        image : req.body.img
     }}).exec();
    res.redirect("/");
});

app.get("/registration", function(req, res) {
    res.render("registration", {layout: false});
});

function dateOfBirth(birth) {
    const dob = /^\d{2}-\d{2}-\d{4}$/;
    return dob.test(birth); 
}

function phoneNum(num) {
    const phone = /^\d{3}-\d{3}-\d{4}$/;
    return phone.test(num); 
}

app.post("/registration", function(req, res){
    var userData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password,
        address: req.body.address,
        dob: req.body.dob,
        phoneNumber: req.body.phoneNumber,
        course: req.body.course,
        email: req.body.email
    }

    if(userData.username == "" || 
        userData.password == "" || 
        userData.dob == "" || 
        userData.phoneNumber == "")
    {
        var userError = "Registration Error";
        res.render("registration", { 
            userError: userError, 
            data: userData, 
            layout: false });
        return;
    }
    else if(!dateOfBirth(userData.dob))
    {
        var dobError = "dd-mm-yyyy";
        res.render("registration", { 
            dobError: dobError, 
            data: userData, 
            layout: false });
    }
    else if(!phoneNum(userData.phoneNumber))
    {
        var phoneError = "";
        res.render("registration", { 
            phoneError: phoneError, 
            data: userData,
            layout: false });
    }
    else if(userData.password.length < 7 || 
            userData.password.length > 12)
    {
        var pssError = "The password length should be between 7 and 12 characters"
        res.render("registration", { 
            passwordError: passwordError, 
            data: userData, 
            layout: false});
    }
    else
    {
        res.render("dashboard", {layout: false});
    }

    bcrypt.hash(userData.password, 10).then(hash=>{
        let accountInfo = new userInfo({
            firstName: userData.firstName,
            lastName: userData.lastName,
            username: userData.username,
            password: hash,
            address: userData.address,
            dob: userData.dob,
            phoneNumber: userData.phoneNumber,
            course: userData.course,
            email: userData.email
        }).save((e, data) =>{
            if(e) {
                console.log(e);
            }
            else {
                console.log(data);
            }
        });
    })
    .catch(err=>{
        console.log(err); 
    });
    
});

app.get('/login', function(req, res){
    res.render("login", {layout: false});
});

app.get("/logout", function(req, res) {
    req.session.reset();
    res.redirect("/login");
  });

function specialChar(str)
{
    const specialChar = /[~`!#@$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/;
    return specialChar.test(str);
}

app.post("/login", function(req, res){

    var loginData = {
        user: req.body.username,
        pass: req.body.password
    }

    if(loginData.user == "" || loginData.pass == "" ) {
        var loginError = "Please fill username and password";
        res.render("login", { 
            loginError: loginError, 
            data: loginData, 
            layout: false 
        });
    }
    else if(specialChar(loginData.usr) == true) {
        var specialError = "Error: Special character is not allowed !!";
        res.render("login", { 
            specialError: specialError, 
            data: loginData, 
            layout: false
        });
    }
    else
    {
        userInfo.findOne({ username: loginData.userName}, ["firstName", "lastName", "username", "password"]).exec().then((data) =>{
            bcrypt.compare(loginData.password, data.password).then((result) => {
                // result === true
                console.log(result);
                if(result == true) {
                    if(data.id == "6396981a3e51c3e4afc9f26d") 
                    {
                        req.session.adminData = {
                            username: loginData.userName,
                            password: loginData.password
                        }
     
                      res.render("adm_dashboard", {
                        firstName:data.firstName, 
                        lastName:data.lastName, 
                        username:data.username, 
                        layout: false});
                      return;
                    }
                    else //user session
                    {
                        req.session.userData = {
                            username: loginData.userName,
                            password: loginData.password
                        }
                    res.render("login_dashboard", {
                        firstName:data.firstName, 
                        lastName:data.lastName, 
                        username:data.username, 
                        layout: false
                    });
                    return;
                    }
                }
                else
                {
                 var userError = "Invalid username";
                 res.render("login", {
                    userError: userError, 
                    data: loginData, 
                    layout: false
                });
                }
            });
         });
    }
});

app.get("/administration", ensureLogin, function(req, res){
    res.render("administration", {layout:false});
});

function ensureLogin(req, res, next) {
    if (!req.session.admData) {
      res.redirect("/login");
    } else {
      next();
    }
  }

app.post("/administration", function(req, res){

    let blogInfo = new blogContent({
        title: req.body.title,
        date : req.body.date,
        content: req.body.content,
        image : req.body.image
    }).save((e, data) =>{
        if(e) {
            console.log(e);
        }
        else {
            console.log(data);
        }
    });
    res.redirect("/");
});

app.use(function(req,res){
    res.status(404).send("Sorry! Page not found");
});

app.listen(HTTP_PORT);