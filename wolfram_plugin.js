var Wolfram = require('node-wolfram');

function WolframPlugin () {
	this.wolfram = new Wolfram(process.env.WOLFRAM_API_KEY)
};

WolframPlugin.prototype.respond = function (bot,query,id/*query, channel, bot,tmpMsg*/) {
	this.wolfram.query(query, function(error, result) {
			if (error) {
				console.log(error);
			} else {
				var response = "";
				if(result.queryresult.$.success == "true"){
					
					if(result.queryresult.hasOwnProperty("warnings")){
						for(var i in result.queryresult.warnings){
							for(var j in result.queryresult.warnings[i]){
								if(j != "$"){
									try {
										bot.sendMessage(id, result.queryresult.warnings[i][j][0].$.text);
									} catch(e){
										console.log("WolframAlpha: failed displaying warning:\n"+e.stack());
									}
								}
							}
						}
					}
					if(result.queryresult.hasOwnProperty("assumptions")){
						for(var i in result.queryresult.assumptions){
							for(var j in result.queryresult.assumptions[i]){
								if(j == "assumption"){
									try {
										bot.sendMessage(id, `Assuming ${result.queryresult.assumptions[i][j][0].$.word} is ${result.queryresult.assumptions[i][j][0].value[0].$.desc}`);
									} catch(e) {
										console.log("WolframAlpha: failed displaying assumption:\n"+e.stack());
									}
								}
							}
						}
					}
					for(var a=0; a<result.queryresult.pod.length; a++)
	        {
	            var pod = result.queryresult.pod[a];
	            response += "**"+pod.$.title+"**:\n";
	            for(var b=0; b<pod.subpod.length; b++)
	            {
	                var subpod = pod.subpod[b];
									//can also display the plain text, but the images are prettier
	                /*for(var c=0; c<subpod.plaintext.length; c++)
	                {
	                    response += '\t'+subpod.plaintext[c];
	                }*/
									for(var d=0; d<subpod.img.length;d++)
									{
										response += "\n" + subpod.img[d].$.src;
										bot.sendMessage(id, response);
										response = "";
									}
	            }
							response += "\n";
	        }
				}	else {
					if(result.queryresult.hasOwnProperty("didyoumeans")){
						var msg = [];
						for(var i in result.queryresult.didyoumeans){
							for(var j in result.queryresult.didyoumeans[i].didyoumean) {
								msg.push(result.queryresult.didyoumeans[i].didyoumean[j]._);
							}
						}
						bot.sendMessage(id, "Did you mean: " + msg.join(" "));
					} else {
						bot.sendMessage(id, "No results from Wolfram Alpha :(");
					}
				}
			}
		});
};

module.exports = WolframPlugin;
