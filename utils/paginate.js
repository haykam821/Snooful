let chunk, properChunk;
try {
	chunk = require("lodash.chunk");
	properChunk = true;
} catch (_) {
	chunk = array => [array];
	properChunk = false;
}

/**
	* Gets data for pagination.
	* @name DataGetFunction
	* @function
	* @param args The arguments from Yargs.
	* @returns *
*/

/**
	* Creates a paginated command using a set of data.
	* If lodash.chunk is not installed, works but without pages.
	* @param {string} command The name of the command.
	* @param {(DataGetFunction|*)} [data] The data to paginate.
	* @param [opts] Other options.
	* @param {string} [opts.description] The command description.
	* @param {string[]} [opts.aliases] The command's aliases.
	* @param {string} [opts.dataType] The plural word used to describe the data.
	* @param {string} [opts.footer] Text to display after the data as a footer.
	* @param {string} [opts.noItemsMessage] The message to display if there are no items to view.
*/
module.exports = (command, data = [], opts = {}) => {
	const options = Object.assign({
		aliases: [],
		dataType: "items",
		description: "",
		footer: "",
		noItemsMessage: "",
	}, opts);

	return {
		aliases: options.aliases,
		builder: builder => {
			builder.positional("page", {
				default: 1,
				describe: "The page number to view.",
				type: "number",
			});
		},
		command: command + " [page]",
		describe: options.description,
		handler: async args => {
			const resolvedData = [].concat(typeof data === "function" ? await data(args) : data);

			const list = chunk(resolvedData.sort(), 5);
			if (resolvedData.length === 0) {
				args.send(options.noItemsMessage || `There are no ${options.dataType} to view.`);
			} else if (args.page <= list.length && args.page > 0) {
				if (Number.isSafeInteger(args.page)) {
					const pageOfText = properChunk ? ` (page ${args.page} of ${list.length})` : "";
					const endText = options.footer ? "\n\n" + options.footer : "";

					args.send(`${resolvedData.length} ${options.dataType}${pageOfText}: \n\n• ${list[args.page - 1].join("\n• ")}${endText}`);
				} else {
					args.send("Page numbers must be integers.");
				}
			} else {
				args.send("That's an invalid page number!");
			}
		},
	};
};
