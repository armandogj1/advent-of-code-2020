'use strict';

const puzzle = [6, 19, 0, 5, 7, 13, 1];

const nSpoken = (input, n) => {
	const spoken = new Map();
	let turn = 1;
	let lastSpoken;

	// speak numbers and their turn
	input.forEach((number, idx) => {
		if (idx === input.length - 1) {
			lastSpoken = number;
		} else {
			spoken.set(number, turn);
			turn += 1;
		}
	});

	while (turn < n) {
		const last = spoken.get(lastSpoken);

		if (last === undefined) {
			spoken.set(lastSpoken, turn);
			lastSpoken = 0;
		} else {
			spoken.set(lastSpoken, turn);
			lastSpoken = turn - last;
		}
		turn += 1;
	}

	return lastSpoken;
};

const firstTime = ([turn, bool]) => bool;

const res = nSpoken(puzzle, 30000000);

console.log(res);
