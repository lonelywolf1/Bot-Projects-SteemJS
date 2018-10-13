const http = require('http');
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
const account = "lonelywolf",
  key = "P5ASDNANDPOPASDNOPDN1231312";

ClaimRewards(account, key);

function ClaimRewards(account, key){
  steem.api.getAccounts([account], function(err, result){
  const sbd = result[0].reward_sbd_balance,
  steem_liquid = result[0].reward_steem_balance,
  sp = result[0].reward_vesting_balance;
  console.log(sbd + " " + steem_liquid + " " + sp);
  steem.broadcast.claimRewardBalance(key, account, steem_liquid, sbd, sp, function(err, result) {
  console.log("Rewards of @" + account + " Have Been Claimed To The Wallet!");
  console.log("Result:");
  console.log(result);
  setTimeout(function(){ClaimRewards(account, key)}, 120*60*1000);
  });
  });
}
