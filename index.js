var express=require('express');
var app=express();
var mongo=require('mongodb').MongoClient;
var bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

var port = process.env.PORT||8080;

app.get('/new/:url',function(req,res){
    var expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    var regex = new RegExp(expression);
    var url=req.params.url;
    if(url.match(regex)){
        var dbURL="mongodb://localhost:27017/tinyurl";
        mongo.connect(dbURL,function(err,db){
            if(err){
                console.log("no connection",err)
            }else{
                var collection =db.collection('urls');
                collection.insert({});
                res.send('regex worked');
            } 
        }); 
    }else{
        res.send({"error":"Wrong url format"});
    }
});


app.get("/:url",function(req,res){
    var dbURL="mongodb://localhost:27017/tinyurl";
    mongo.connect(dbURL,function(err,db){
        if(err){
            res.send(err);
        }else{
           var collection =db.collection('urls');
           collection.find({"tiny":req.params.url}).toArray(function(err,result){
               if(err){
                   res.send("No document found")
               }else if(result.length>0){
                  
                  res.redirect(result[0].url); 
               }else{
                   res.send("No such url in our system");
               }
               db.close();
           });
        }
    });
});

app.listen(port);