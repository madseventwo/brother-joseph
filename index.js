const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
// const mongoose = require('mongoose');

// Client Init
const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions]
});

// Map to store book information
global.bookInfoMap = new Map();

//Event Emitter
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
module.exports = { eventEmitter };

// Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	console.log(`Adding command ${file}...`);
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	client.commands.set(command.data.name, command);
}
// console.log(client.commands);

// Button Command Handler
client.buttonCommands = new Collection();
const buttonCommandsPath = path.join(__dirname, 'commands/buttons');
const buttonCommandFiles = fs.readdirSync(buttonCommandsPath).filter(file => file.endsWith('.js'));

for (const file of buttonCommandFiles) {
	const filePath = path.join(buttonCommandsPath, file);
	const buttonCommand = require(filePath);

	client.buttonCommands.set(buttonCommand.customId, buttonCommand);
}

// Select Menu Command Handler
client.menuCommands = new Collection();
const menuCommandsPath = path.join(__dirname, 'commands/menus');
const menuCommandFiles = fs.readdirSync(menuCommandsPath).filter(file => file.endsWith('.js'));

for (const file of menuCommandFiles) {
	const filePath = path.join(menuCommandsPath, file);
	const menuCommand = require(filePath);

	client.menuCommands.set(menuCommand.customId, menuCommand);
}

// Mongo Connect & Events
/* mongoose
	.set('strictQuery', false)
	.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(
		() => { console.log('Connected to DB.'); },
		err => { console.log(err); },
	);

mongoose
	.connection.on('connecting', err => {
		console.log(err);
	  });

mongoose
	.connection.on('error', err => {
		console.log(err);
	  });

mongoose
	  .connection.on('disconnected', err => {
		console.log(err);
	  });

*/

client.login(token); 