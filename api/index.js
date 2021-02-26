const MongoClient = require("mongodb").MongoClient;
const connection_string = "mongodb://localhost:27017/"
const express = require("express");
var ObjectId = require("mongodb").ObjectId;
var bodyParser = require("body-parser");
var cors = require("cors")
const app = express()
var jsonParser = bodyParser.json();

app.use(cors());

MongoClient.connect(connection_string,{ useUnifiedTopology: true },function(err,client){
    if(err) throw error;
    console.log("connected to mongodb");
    var db = client.db("booking");

    app.get("/requests",function(req,res){
        db.collection("requests").find({}).toArray(function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.get("/pendingrequests",function(req,res){
        db.collection("requests").find({rejected:"false"}).toArray(function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.get("/appointments",function(req,res){
        db.collection("appointments").find({}).toArray(function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.get("/customerscount",function(req,res){
        db.collection("customers").find({}).toArray(function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.get("/slots",function(req,res){
        db.collection("slots").find({vacant:"true"}).toArray(function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.get("/rejectrequests/:id",function(req,res){
        var id= new ObjectId(req.params.id);
        db.collection("requests").updateOne({_id:id},{$set:{rejected:"true"}},(function(err,data){
            if(err) throw error;
        }));
    })
    app.post("/createslots",jsonParser,function(req,res){
        var date1 = req.body.date;
        var time1 = req.body.time+":00";          
        db.collection("slots").insertOne({date:date1,time:time1,vacant:"true"},(function(err,data){
            if(err) throw error;
        }));
    })
    app.delete("/removerequest/:id",function(req,res){
        let id = new ObjectId(req.params.id);
        db.collection("requests").deleteOne({_id:id},function(err,data){
            if(err) throw error;
            res.send(data);
        })
    });
    app.post("/addappointments",jsonParser,function(req,res){
        let appointment ={
			customerid : req.body.customerid,
			customername : req.body.customername,
			slotid : req.body.slotid,
			date : req.body.date,
			time : req.body.time,
		}
        db.collection("appointments").insertOne(appointment,(function(err,data){
            if(err) throw error;
        }));
    });
    app.listen(8000);
});