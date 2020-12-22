const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const player1 = [];
const player2 = [];
let curr = player1;

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const cleanLine = line.trim();

	if (!cleanLine.length) {
		curr = player2;
	} else {
		const num = Number(cleanLine);
		if (!isNaN(num)) {
			curr.push(num);
		}
	}
});

lineReader.on('close', () => {
	// run function
	console.log(player1);
	console.log(player2);

	const decks = recursiveCombat(player1, player2, new Set());
	const winner = getWinner(decks);
	console.log(winner);
	const score = getScore(winner);
	console.log('this is score', score);
	// console.log(decks);
});

const compareCards = (card1, card2) => {
	if (card1 > card2) {
		return ['p1', card1, card2];
	} else {
		return ['p2', card2, card1];
	}
};

const playGame = (p1, p2) => {
	let count = 0;
	while (p1.length && p2.length) {
		const card1 = p1.shift();
		const card2 = p2.shift();

		const [winner, ...cards] = compareCards(card1, card2);

		if (winner === 'p1') {
			p1.push(...cards);
		} else {
			p2.push(...cards);
		}
		count += 1;
	}

	// return p1.length ? p1 : p2;
	return [p1, p2, count];
};

const getWinner = (decks) => {
	return decks.filter((x) => {
		if (Array.isArray(x)) {
			return x.length > 0;
		}
		return false;
	})[0];
};

const getScore = (winner) => {
	const reverse = winner.reverse();

	return reverse.reduce((acc, card, idx) => {
		return acc + card * (idx + 1);
	}, 0);
};

/*********************
 *  Recursive Combat *
 **********************/

const recursiveCombat = (p1, p2) => {
	let count = 0;
	const memo = new Set();

	while (p1.length && p2.length) {
		if (memo.has(JSON.stringify([p1, p2]))) {
			return ['Player 1 wins due to repetition'];
		}
		memo.add(JSON.stringify([p1, p2]));

		const card1 = p1.shift();
		const card2 = p2.shift();

		// check lengths of decks
		if (p1.length >= card1 && p2.length >= card2) {
			const copyP1 = p1.slice(0, card1);
			const copyP2 = p2.slice(0, card2);

			const [winner1, winner2] = recursiveCombat(copyP1, copyP2);

			if (winner1.length) {
				p1.push(...[card1, card2]);
			} else {
				p2.push(...[card2, card1]);
			}
		} else {
			const [winner, ...cards] = compareCards(card1, card2);

			if (winner === 'p1') {
				p1.push(...cards);
			} else {
				p2.push(...cards);
			}
		}
		count += 1;
	}

	// return p1.length ? p1 : p2;
	return [p1, p2, count];
};
