/* eslint-env node */

//"use strict";

var express = require("express");
var mongojs = require("mongojs");
var internalIp = require("internal-ip");
var bodyParser = require("body-parser");
var path = require("path");
var moment = require('moment');

var app = express();
var PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("public"));

var databaseUrl = "comments";
var collections = ["commentData"];

moment().format();

var db = mongojs(databaseUrl, collections);
db.on("error", function (error){
	console.log("Database Error!", error);
});

app.get("/", function (req,res){
	console.log("Client GET /")
	res.sendFile(path.join(__dirname,"index.html"));
});

app.post("/submit", function(req, res) {
	console.log(req.body);
	var dataToAdd = {
		name: req.body.name,
		email: req.body.email,
		comment: req.body.comment,
		dateSubmitted: moment().toJSON()
	}
	//res.json(req.body);
	db.commentData.insert(dataToAdd, function(err,doc){
		console.log("Comment Added", dataToAdd.name, dataToAdd.email);
        res.end();
	});
});

app.listen(PORT, function(){
	console.log("App running on",internalIp.v4.sync(),"port", PORT);
	console.log("Server started on", moment().format("dddd, MMMM Do YYYY, h:mm:ssa"));
});

//b437ac05-5c0c-454c-8ef6-7da1d4d9433f
