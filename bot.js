var token = process.env.TOKEN;

var Bot = require('node-telegram-bot-api');
var bot;

var wa = require("./wolfram_plugin");
var wolfram_plugin = new wa();

if(process.env.NODE_ENV === 'production') {
	bot = new Bot(token);
	bot.setWebHook(process.env.HEROKU_URL + bot.token);
}
else {
	bot = new Bot(token, { polling: true });
}

console.log('Bot server started');

bot.onText(/^/, function (msg) {
	
	var id = msg.chat.id;
	
	const args = msg.text.slice("/").trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	
	var text = args.join(" ");
	
	switch(command) {
		case 'start':
			answer = 'Чтобы воспользоваться wolframalpha введите команду /wolfram [запрос] ';
			bot.sendMessage(id, answer);
			break;
			
		case 'wolfram':
			answer = '*Ожидание Wolfram Alpha...*';
			if(!text){
				answer = 'Использование: /wolfram <запрос> (Например /wolfram integrate 4x)';
			}
			bot.sendMessage(id, answer).then(message => {
				wolfram_plugin.respond(bot,text,id);
			});
			break;
	}
});

module.exports = bot;