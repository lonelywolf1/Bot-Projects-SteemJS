let steem = require('steem');

//This User Is Official Steem-JS guest user, you can only post and vote through the Posting WIF.
const ACC_NAME = 'guest123',
	ACC_KEY = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg',
	TARGET = 'pharesim',
	MINIMUM = 10; //100% = 100000, 10% = 10000

steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });

console.log("Curation Trail Bot Script Running...");
console.log("Waiting for votes from @" + TARGET);

steem.api.streamTransactions('head', function(err, result){
	const type = result.operations[0][0];
	const data = result.operations[0][1];
	if (type == 'vote' && data.voter == TARGET) {
		console.log('@' + TARGET + ' Just voted now!');
	if (data.weight < MINIMUM*1000)
		weight = MINIMUM*1000;
	else 
		weight = data.weight;
		
	StreamVote(data.author, data.permlink, weight);
	//Optional
	StreamFollow(data.author);
	}
});

function StreamVote(author, permalink, weight) {
	steem.broadcast.vote(ACC_KEY, ACC_NAME, author, permalink, weight, function(err, result) {
		console.log('Voted Succesfully, permalink: ' + permalink + ', author: ' + author + ', weight: ' + weight / 1000 + '%.');
	});
}

//Optional
function StreamFollow(following){
  var json = JSON.stringify(
  ['follow', {
  follower: ACC_NAME,
  following: following,
  what: ['blog']
  }]);
  
   steem.broadcast.customJson(ACC_KEY, [], [ACC_NAME], 'follow', json, function(err, result) {
  console.log("Follow: " + following + " Successfully!");
  });
}
