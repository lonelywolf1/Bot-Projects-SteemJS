var socket = io("http://localhost:8000");
$(document).ready(function () {
    socket.on("update_label", function (res) {
        $("#not-id").html(res.message);
    });
    var isVote = false;
    $("#vote-strength").on("change", function () {
        $("#vote-strength-value").html($("#vote-strength").val() + "%");
    });
    $("#vote-show").click(function () {
        if (!isVote) {
            $("#v-s").show(200);
            $("#comment-area").hide();
            isVote = true;
            isComment = false;
        } else {
            var details = {
                "name": $("#steem-username").val(),
                "wif": $("#steem-password").val(),
                "url": $("#steem-url").val(),
                "weight": $("#vote-strength").val()
            };
            socket.emit("vote", details);
        }
    });
    $("#resteem").click(function(){
        var details = {
            "name": $("#steem-username").val(),
            "wif": $("#steem-password").val(),
            "url": $("#steem-url").val()
        };
        var memo = details.url.split('/'),
            author = memo[4].split('@')[1],
            permlink = memo[5];
        streamResteem(details.name, details.wif, permlink, author)
    });
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
});
