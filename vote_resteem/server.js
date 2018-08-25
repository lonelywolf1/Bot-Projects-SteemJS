const steem = require('steem'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    socket = require('socket.io'),
    port = 8000;

//App setup
var app = express();
var server = app.listen(port, function () {
    console.log("listening to port " + port);
    console.log("script is running...");
});
var io = socket(server);

app.use(express.static(path.resolve('./')));

io.on('connection', function (socket) {
    console.log("socket connected!");
    
    socket.on("vote", function(details){
        const memo = details.url.split('/'),
              author = memo[4].split('@')[1],
              permlink = memo[5];
        streamVote(details.name, details.wif, author, permlink, parseInt(details.weight*100));       
        var newWeight = details.weight;
        socket.emit("update_label", {
            "message": "Voted Sucessfully, author: " + author + ", weight: " + newWeight + "%"
        });
    });    
    
    socket.on("resteem", function(details){
        const memo = details.url.split('/'),
              author = memo[4].split('@')[1],
              permlink = memo[5];
        streamResteem(details.name, details.wif, permlink, author);
        socket.emit("update_label", {
            "message": "Resteemed Successfully!"
        });
    });
});

//Vote Post Function
function streamVote(ACC_NAME, ACC_KEY, author, permalink, weight) {
	steem.broadcast.vote(ACC_KEY, ACC_NAME, author, permalink, weight, function(err, result) {
		if(err) return console.log(err);
        else
		  return console.log('Voted Succesfully, permalink: ' + permalink + ', author: ' + author + ', weight: ' + weight / 100 + '%.');
	});
}

// Resteem Post Function
function streamResteem(ACC, ACC_KEY, permlink, author) {
	const json = JSON.stringify([
		'reblog',
		{
			account: ACC,
			author: author,
			permlink: permlink
		}
	]);
	steem.broadcast.customJson(ACC_KEY, [], [ACC], 'follow', json, (err, result) => {
		if(!!err)
			console.log("Resteem Failed!", err);
		else
			console.log("Resteemed Succesfully, Friend Name: " + author);
	});
}

function makeid(number) {
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";

  for (var i = 0; i < number; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}