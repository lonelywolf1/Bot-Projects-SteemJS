let steem = require('steem'); //Importing Steem Package

const percentage = 50; //If Higher Than This Number, Win.

//This Is The Official Steem-JS Guest User, You Can Only Vote And Post With The Posting WIF.
const ACC_NAME = 'guest123', //Account Name
	ACC_KEY = '5JRaypasxMx1L97ZUX7YuC5Psb5EAbF821kkAGtBj7xCJFQcbLg', //Account WIF (Active Key Only Work On This Script)
	MINIMUM_AMOUNT = 0.01; // Minimum Gamble Amount
console.log("Gambling Game Script Running...");
setTimeout(function(){console.log("Waiting For Transfers...");}, 500);

steem.api.setOptions({ url: 'wss://rpc.buildteam.io' }); // Custom Websocket.

steem.api.streamTransactions('head', function(err, result) { //Streaming The latest Transactions That Goes Through The Steem Blockchain
    let type = result.operations[0][0]; // transaction type
    let data = result.operations[0][1]; // transaction data
		if(type == 'transfer' && data.to == ACC_NAME){ // Checking if transaction type is `transfer` and check if the reciever is our accout.
				if(data.amount.split(' ')[1] == "STEEM"){ // Checking The Token Type
					SendTransfer(data.from, "Thanks for you donation, we really appreciate that. if this is not a donation please contact us!", 0.001);
					console.log("Donation From " + data.from + ", " + data.amount);
				}else{
					if(data.memo == "Gamble"){ //Checking If The Transfer Is For Gamble
						if(data.amount.split(' ')[0] < MINIMUM_AMOUNT){ // Checking If The Amount Is Below The Minimum Amount
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

//Example Gamble
//Gamble("guest123", 0.001); 

function Gamble(Gambler, Amount){
	const rand = Math.floor(Math.random() * 100) + 1; //Random Number between 1 to 100
	if(rand > percentage){ //Checking if the random number is higher than our percentage
    let WinnerAmount;
    if(Amount > 0.01){
      WinnerAmount = Amount*1.95;
    }else{
      WinnerAmount = Amount*2; //if the amount is less than 0.01 it will double the win amount because you can't send 0.00195.
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
	steem.broadcast.transfer(ACC_KEY, ACC_NAME, Name, Amount, Memo, function(err, result) { //Send Transfer
    console.log(err, "Sent " + Amount + " To " + Name + " With The Memo: " + Memo);
	});
}
