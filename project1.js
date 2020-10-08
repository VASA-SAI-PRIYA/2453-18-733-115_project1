var express= require('EXPRESS');
//const { MongoClient } = require("mongodb");
const app =express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended:true}));
app.use(bodyParser.json());


const MongoClient1 = require('mongodb').MongoClient;

let server1 = require('./server'); 
let config = require('./config');
let middleware = require('./middleware');
const reponse = require('express'); 


//DATABASE CONNECTION
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'HospitalManagement';
let db

MongoClient1.connect(url,{ useUnifiedTopology: true}, (err, client) =>{
    if (err) return console.log(err);
    db = client.db(dbName);
    console.log('Connected MongoDB:',url);
    console.log('Database:',dbName);
})

//FETCHING HOSPITAL DETAILS
app.get('/hospitaldetails',middleware.checkToken, function(req, res){
    console.log("Fetching data from Hospital collection");
    var dat = db.collection('Hospital').find().toArray().then(result => res.json(result));
});

//VENTILATORS DETAILS
app.get('/ventilatordetails',middleware.checkToken,(req, res) => {
    console.log("Ventilators Information");
    var ventilatordetails = db.collection('Ventilator').find().toArray().then(result => res.json(result));
});

//SEARCH VENTILATORS BY STATUS
app.post('/searchventbystatus',middleware.checkToken,(req, res) => {
    var status = req.body.status;
    console.log(status);
    var ventilatordetails = db.collection('Ventilator').find({"status": status }).toArray().then(result => res.json(result));
});

//SEARCH VENTILATORS BY HOSPITAL NAME
app.post('/searchventbyname',middleware.checkToken,(req, res) => {
    var name = req.body.name;
    console.log(name);
    var ventilatordetails = db.collection('Ventilator').find({'name':new RegExp(name, 'i')}).toArray().then(result => res.json(result));
});

//SEARCH HOSPITAL BY NAME
app.post('/searchhospbyname',middleware.checkToken,(req, res) => {
    var name = req.body.name;
    console.log(name);
    var hospitaldetails = db.collection('Hospital').find({'name':new RegExp(name, 'i')}).toArray().then(result => res.json(result));
});

//UPDATE VENTILATOR DETAILS
app.put('/updateventilator',middleware.checkToken,(req, res) => {
    var ventid = { ventilatorId: req.body.ventilatorId };
    console.log(ventid);
    var newvalues = {$set: { status: req.body.status }};
    db.collection("Ventilator").updateOne(ventid, newvalues, function(err, result){
        res.json('1 document updated');
        if (err) throw err;
        // console.log("1 document updated");
    });
});

//ADD VENTILATOR
app.post('/addventilatorbyhosp',middleware.checkToken,(req, res) => {
    var hId = req.body.hId;
    var ventilatorId = req.body.ventilatorId;
    var status = req.body.status;
    var name = req.body.name;
    var item ={ hId:hId, ventilatorId:ventilatorId,status:status,name:name};
    db.collection('Ventilator').insertOne(item, function(err,result){
        res.json('Item inserted');
    });
});

//DELETE VENTILATOR BY VENTILATORiD
app.delete('/deleteventbyventid',middleware.checkToken,(req, res)=>{
    var mybody= req.body.ventilatorId;
    console.log(mybody);
    var mybody = {ventilatorId : mybody};
    db.collection('Ventilator').deleteOne(mybody, function (err, obj){
        if (err) throw err;
        res.json("1 document deleted");
    });
});
app.listen(800);