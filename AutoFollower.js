const http = require('http');
const steem = require('steem');
const port = 80; //you can use any other port, like 3000 or something.
const hostIP = "localhost"; //or "127.0.0.1" which is better for you.

const server = http.createServer((req, res) => {
res.statusCode = 200;

res.setHeader('Content-type', 'text-plain');

res.end('Hello World! this is my first project at node.js!');

});

server.listen(port, hostIP, () => {

console.log("Listen to port " + port);

});

var user = "lonelywolf", tag = "cryptocurrency", key = "***", limit = 3;

AutoFollower(user, tag, key, limit);

function AutoFollower(user, tag, key, limit){
          var count = 0;
      steem.api.getDiscussionsByCreated({tag: tag, limit: limit}, function(err, result){
          if(!!err)
          throw err;
          result.forEach(function(row){
            var follower = user;
              var following = row.author;
              var json = JSON.stringify(
              ['follow', {
              follower: follower,
              following: following,
              what: ['blog']
              }]);
              count+=5;
              setTimeout(function(){
            steem.broadcast.customJson(key, [], [follower], 'follow', json, function(err, result) {
                console.log(err, result);
            });}, count*1000);
          });
      });
    setTimeout(function(){AutoFollower(user, tag, key, limit)}, 30*60*1000);
}
