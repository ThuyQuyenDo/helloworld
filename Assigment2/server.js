var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");

var HTTP_PORT = process.env.port || 8080

function onHttpSStart(){
    console.log("Express http server listening on: " + HTTP_PORT);
}

// setup a 'route' to listen on the default url path
app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "/home.html"));
});

// setup http server to listen on HTTP_PORT
app.get("/blog",function(req,res){
    res.sendFile(path.join(__dirname,"/blog.html"))
});

app.listen(HTTP_PORT, onHttpSStart);