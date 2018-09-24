const chance = require("chance").Chance();
const dym = require("didyoumean2");

const choices = [
	"paper",
	"rock",
	"scissors",
];
const beats = {
	paper: "rock",
	rock: "scissors",
	scissors: "paper",
};

module.exports = {
	builder: build => {
		build.positional("option", {
			describe: "The option you want to play.",
			type: "string",
		});
	},
	command: "rps [option]",
	describe: "Plays rock-paper-scissors with the bot.",
	handler: args => {
		if (args.option) {
			const yourChoice = dym(args.option, choices, {
				threshold: 0.7,
			});

			if (yourChoice === null) {
				args.send(args.localize("rps_move_invalid", choices.join(", ")));
			} else {
				const msg = args.localize("rps_countdown") + "\n\n";
				const myChoice = chance.pickone(choices);

				if (myChoice === yourChoice) {
					args.send(msg + args.localize("rps_tie", myChoice, yourChoice));
				} else if (beats[myChoice] === args.option) {
					args.send(msg + args.localize("rps_lose", myChoice, yourChoice));
				} else {
					args.send(msg + args.localize("rps_win", myChoice, yourChoice));
				}
			}
		} else {
			args.send(args.localize("rps_move_unspecified"));
		}
	},
};
