const readline = require('readline');
const { createReadStream } = require('fs');

const rows = [];
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const cleanLine = line.trim().split('');
	rows.push(cleanLine);
});

lineReader.on('close', () => {
	// console.log(rows);
	console.log('treeCount', treeCounter(rows, 1));
	console.log('treeCount', treeCounter(rows, 3));
	console.log('treeCount', treeCounter(rows, 5));
	console.log('treeCount', treeCounter(rows, 7));
	console.log('treeCount', treeCounter(rows, 1, 2));

	console.log(
		'treeTotal',
		treeCounter(rows, 1) *
			treeCounter(rows, 3) *
			treeCounter(rows, 5) *
			treeCounter(rows, 7) *
			treeCounter(rows, 1, 2)
	);
});

const treeCounter = (map, right, down = 1) => {
	// counter for column position and trees
	let col = 0;
	let treeCount = 0;
	let rowLength = map[0].length;
	console.log('this is length', rowLength);

	// iterate over the array
	for (let i = 0; i < map.length; i += down) {
		// check current position
		const pos = map[i][col];

		// if position is a tree
		if (pos === '#') {
			// increment tree count
			treeCount += 1;
		}

		// increment position for next step
		// ensure it wraps around to account for repeating pattern
		// console.log(col);
		col = (col + right) % rowLength;
	}
	//return count
	return treeCount;
};
