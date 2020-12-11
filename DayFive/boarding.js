const readline = require('readline');
const { createReadStream } = require('fs');

const boardingPasses = [];
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const cleanLine = line.trim();

	if (cleanLine.length > 0) {
		boardingPasses.push(cleanLine);
	}
});

lineReader.on('close', () => {
	// run function
	// console.dir(boardingPasses);
	// console.log(splitRowCol(boardingPasses[0]));
	// const [rows, cols] = splitRowCol(boardingPasses[2]);
	// console.log('this is row position', findRowOrCol(rows, seatRows, 'F'));
	// console.log('this is col position', findRowOrCol(cols, seatCols, 'L'));
	const allids = storeIds(boardingPasses);
	const ordered = getHighestId(allids);
	const missed = findMissing(ordered);
	console.log(ordered.slice(440));
	console.log(missed);
});

const seatRows = Array.from({ length: 128 }, (v, i) => i);
const seatCols = Array.from({ length: 8 }, (v, i) => i);

const splitRowCol = (boardingPass) => {
	const row = boardingPass.slice(0, boardingPass.length - 3);
	const col = boardingPass.slice(boardingPass.length - 3);

	return [row, col];
};

const findRowOrCol = (instruction, position, frontOrLeft) => {
	// console.log(rowInstruction);
	// console.log(position);
	if (instruction.length === 0) {
		// console.log('this', position);
		return position[0];
	}
	// console.log(instruction[0], frontOrLeft);
	// console.log(position);
	const midPoint = Math.floor(position.length / 2);
	if (instruction[0] === frontOrLeft) {
		return findRowOrCol(
			instruction.slice(1),
			position.slice(0, midPoint),
			frontOrLeft
		);
	} else {
		return findRowOrCol(
			instruction.slice(1),
			position.slice(midPoint),
			frontOrLeft
		);
	}
};

const storeIds = (tickets) => {
	const ids = tickets.map((ticket) => {
		// console.log(ticket);
		const [rows, cols] = splitRowCol(ticket);
		// console.log(rows, cols);
		const rowPos = findRowOrCol(rows, seatRows, 'F');
		const colPos = findRowOrCol(cols, seatCols, 'L');
		// console.log(rowPos, colPos);

		return rowPos * 8 + colPos;
	});

	return ids;
};

const getHighestId = (ids) => {
	const sortedIds = ids.sort((a, b) => a - b);
	return sortedIds;
};

const findMissing = (ids) => {
	let count = ids[0];
	let missing = null;

	ids.forEach((id) => {
		if (missing === null && id !== count) {
			missing = count;
		}
		count += 1;
	});

	return missing;
};
