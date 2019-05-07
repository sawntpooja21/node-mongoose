var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');

var app = express();
var dbUri = 'mongodb://localhost:27017/api';
var dbconn = mongoose.createConnection(dbUri); 
var Schema =mongoose.Schema;
var postSchema =new Schema({
	title: String,
	text: String
});

var Post = dbconn.model('Post',postSchema,'posts');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){
	res.sendFile('index1.html', { root: '.' });
});

app.get('/login',function(req,res){
	res.sendFile('login1.html', { root: '.' });
});

app.get('/update',function(req,res){
	res.sendFile('update.html', { root: '.' });
});

app.get('/view-data',function(req, res, next){
	Post.find({}, function(error, posts){
		if(error) return next(error);
			res.send(posts);
			
	});
});

/*app.post('/posts',function(req,res,next){
	var post = new Post(req.body);
	post.server(function(error,results){
		if(error) return next(error);
		res.send(results);
	});
}); */

app.post('/insert-data',function(req,res,next){
	var item={
		title : req.body.title,
		text : req.body.text
	};	
	var data = new Post(item);
	
	data.save(function(error,results){
		if(error) return next(error);
		res.send(results);
	});
});

app.post('/login',function(req,res){
	var title = req.body.title;
	var text = req.body.text;
	
	Post.findOne({title: title, text: text},function(err,user){
	if(err){
		console.log(err);
		return res.status(500).send();
	}
	if(!user){
		//return res.status(404).send();
		return res.send('Invalid');
	}
	//return res.status(200).send();
	return res.send('successfull');
	});
});

app.post('/update',function(req,res){
	var title = req.body.title;
	Post.findOne({title: title}, function(err,doc){
		if(err){
			console.log(err);
			res.status(500).send();
		}
	
			if(!doc){
				res.status(404).send();
			}
		
		else{
			if(req.body.title){
				doc.title = req.body.title;
			}
			if(req.body.text){
				doc.text = req.body.text;
			}
			
			doc.save(function(err, updateObj){
				if(err){
					console.log(err);
					res.status(500).send();
				}
				else{
					res.send(updateObj);
				}
			});
		}
		
	});
	
	
	
	
});

var server = app.listen(5000, function () {
    console.log('Node server is running..');
});