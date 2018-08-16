/**
 * The prefix required by commands to be considered by the bot.
 */
const prefix = "!";

const yargs = require("yargs");
yargs.commandDir("commands");

/**
 * Logs an end user-initiated fail (non-interrupting) to console.
 */
function safeFail() {
    return process.stdout.write("Someone or something failed. This might not be bad.\n");
}
yargs.fail(safeFail);
yargs.exitProcess(false);

/**
 * The client information.
 */
let clientInfo = {};

/**
 * Runs a command.
 * @param {string} command The command to run, including prefix.
 */
function handleCommand(command = "", channel = {}, message = {}) {
	if (command.startsWith(prefix) && message._sender.nickname !== username) {
		const unprefixedCmd = command.replace(prefix, "");

		try {
			yargs.parse(unprefixedCmd, {
				prefix,
				channel,
				message,
				client,
				send: message => {
					channel.sendUserMessage(message, () => {});
				},
				usage: yargs.getUsageInstance().getCommands(),
			});
		} catch {
			safeFail();
		}
	}
}

const Sendbird = require("sendbird");
const sb = new Sendbird({
	appId: "2515BDA8-9D3A-47CF-9325-330BC37ADA13" // reddit chat!!
});

sb.connect(process.env["SNOOFUL_ID"], process.env["SNOOFUL_TOKEN"], userInfo => client = userInfo);

const handler = new sb.ChannelHandler();
handler.onMessageReceived = (channel, message) => handleCommand(message.message, channel, message);
sb.addChannelHandler("handler", handler);