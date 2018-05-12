const http = require('http');
const steem = require('steem');
const hostIP = "localhost";
const port = 80;

const server = http.createServer((req, res) => {
res.statusCode = 200;

res.setHeader('Content-type', 'text-plain');

res.end('Hello World! this is my first project at node.js!');

});

server.listen(port, hostIP, () => {

console.log("Listen to port " + port);

});


const percentage = 50;

const ACC_NAME = 'lonelywolf',
	ACC_KEY = 'ss',
	MINIMUM_AMOUNT = 0.01;

console.log("Gambling Game Script Running...");
console.log("Waiting For Transfers...");

steem.api.setOptions({ url: 'wss://rpc.buildteam.io' });

steem.api.streamTransactions('head', function(err, result) {
    let type = result.operations[0][0];
    let data = result.operations[0][1];
		if(type == 'transfer' && data.to == ACC_NAME){
				if(data.amount.split(' ')[1] == "STEEM"){
					SendTransfer(data.from, "Thanks for you donation, we really appreciate that. if this is not a donation please contact us!", 0.001);
					console.log("Donation From " + data.from + ", " + data.amount);
				}else{
					if(data.memo == "Gamble"){
						if(data.amount.split(' ')[0] < MINIMUM_AMOUNT){
							console.log("Wrong Gamble, reason: below the minimum.");
							SendTransfer(data.from, "Your Gamble Amount Is Less Than The Minimum, The Minimum Is " + MINIMUM_AMOUNT + " SBD", data.amount);
						}else{
							console.log("Incoming Gamble From " + data.from);
							Gamble(data.from, data.amount.split(' ')[0]);
						}
					}
				}
		}
});

Gamble("guest123", 0.001);

function Gamble(Gambler, Amount){
	const rand = Math.floor(Math.random() * 100) + 1;
	if(rand > percentage){
    let WinnerAmount;
    if(Amount > 0.01){
      WinnerAmount = Amount*1.95;
    }else{
      WinnerAmount = Amount*2;
    }

    SendTransfer(Gambler, "You Won This Round! Number: " + rand +", Your Gamble - " + Amount + " SBD, You Earned Totally: " + Amount*0.95 + " SBD. Come Back Anytime!", WinnerAmount);
		console.log("Gambler " + Gambler + " Won!");
	}else{
		SendTransfer(Gambler, ":(, You Lose This Round, Your Number: " + rand + ", Best Of Luck Next Time!", 0.001);
		console.log("Gambler " + Gambler + " Lost!");
	}
}


function SendTransfer(Name, Memo, Amount){
	Amount = Amount.toString() + " SBD";
	steem.broadcast.transfer(ACC_KEY, ACC_NAME, Name, Amount, Memo, function(err, result) {
    console.log(err, "Sent " + Amount + " To " + Name + " With The Memo: " + Memo);
	});
}
