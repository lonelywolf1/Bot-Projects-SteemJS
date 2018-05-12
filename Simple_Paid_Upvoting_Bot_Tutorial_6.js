let steem = require('steem');

//This Is The Official Steem-JS Guest User, You Can Only Vote And Post With The Posting WIF.
const ACC_NAME = 'guest123',
	ACC_KEY = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg';

//Example Vote, Delete /* */ to try
/*

streamVote("https://steemit.com/utopian-io/@lonelywolf/bot-build-6-simple-paid-upvoting-bot", "0.01 SBD");

*/

console.log("Paid Voting Bot Script Running...");
console.log("Waiting For Transfers...");
steem.api.streamTransactions('head', function(err, result) {
    let type = result.operations[0][0];
    let data = result.operations[0][1];
		console.log(type, data);
     if(type == 'transfer' && data.to == ACC_NAME) {
			 console.log("Incoming request for vote from: " + data.from +", value: " + data.amount + "\n\n");
        streamVote(data.memo, data.amount);
    }
});

function calculateVotingWeight(amountPaid){
	const token = amountPaid.split(' '),
	tokenType = token.pop(),
	tokenValue = token.shift();
	let weight;
	if (tokenValue >= 0.5){
		weight = 100;
	} else if (tokenValue >= 0.1) {
		weight = 40;
	} else {
		weight = 20;
	}
	const steemToSbdRatio = 1.1;
	if( tokenType == 'STEEM') {
		return parseInt((weight * steemToSbdRatio) * 500);
	} else {
		return weight * 500;
	}
}


function streamVote(url, amount) {
	const memo = url.split('/');
	const author = memo[4].split('@')[1];
	const weight = calculateVotingWeight(amount);
	steem.broadcast.vote(ACC_KEY, ACC_NAME, author, memo[5], weight, function(err, result) {
		console.log('Voted Succesfully, permalink: ' + memo[5] + ', author: ' + author + ', weight: ' + weight / 1000 + '%.', err);
	});
}
