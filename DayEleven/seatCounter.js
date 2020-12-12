const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const seats = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const clean = line.trim().split('');

	seats.push(clean);
});

lineReader.on('close', () => {
	// run function

	console.log(allRounds(seats));
});

const toggleSeat = (row, col, seatChart) => {
	// toggled seat and counter
	const seat = seatChart[row][col];
	if (seat === '.') return '.';

	const toggled = seat === 'L' ? '#' : 'L';
	let count = 0;

	if (
		seatChart[row - 1] &&
		lookPastFloor(row - 1, col - 1, seatChart, 'topMajor')
	)
		count += 1;
	if (seatChart[row - 1] && lookPastFloor(row - 1, col, seatChart, 'top'))
		count += 1;
	if (
		seatChart[row - 1] &&
		lookPastFloor(row - 1, col + 1, seatChart, 'topMinor')
	)
		count += 1;
	if (lookPastFloor(row, col - 1, seatChart, 'left')) count += 1;
	if (lookPastFloor(row, col + 1, seatChart, 'right')) count += 1;
	if (
		seatChart[row + 1] &&
		lookPastFloor(row + 1, col - 1, seatChart, 'bottomMinor')
	)
		count += 1;
	if (seatChart[row + 1] && lookPastFloor(row + 1, col, seatChart, 'bottom'))
		count += 1;
	if (
		seatChart[row + 1] &&
		lookPastFloor(row + 1, col + 1, seatChart, 'bottomMajor')
	)
		count += 1;

	if (count === 0 && seat === 'L') return '#';

	if (count >= 5 && seat === '#') return 'L';

	return seat;
};

const isOcuppied = (i, j, seats) => seats[i] && seats[i][j] === '#';

const checkAllSeat = (seats) => {
	const newSeats = [];

	for (let row = 0; row < seats.length; row++) {
		const currRow = seats[row].map((seat, col) => {
			return toggleSeat(row, col, seats);
		});
		newSeats.push(currRow);
	}

	return newSeats;
};

const allRounds = (seats) => {
	let currSeats = JSON.stringify(seats);
	let stabilized = false;
	let count = 0;

	while (!stabilized) {
		const prior = JSON.parse(currSeats);
		const currRound = JSON.stringify(checkAllSeat(prior));

		if (currRound === currSeats) {
			stabilized = true;
		}

		currSeats = currRound;
	}

	return currSeats.match(/#/g).length;
};

const lookPastFloor = (i, j, seats, direction) => {
	// check whether current position is occupied
	if (isOcuppied(i, j, seats)) {
		return true;
	} else if (seats[i] && seats[i][j] === '.') {
		// check if it is a floor
		if (direction === 'left') {
			return lookPastFloor(i, j - 1, seats, direction);
		} else if (direction === 'right') {
			// console.log(i, j);
			return lookPastFloor(i, j + 1, seats, direction);
		} else if (direction === 'top') {
			return lookPastFloor(i - 1, j, seats, direction);
		} else if (direction === 'bottom') {
			return lookPastFloor(i + 1, j, seats, direction);
		} else if (direction === 'topMajor') {
			return lookPastFloor(i - 1, j - 1, seats, direction);
		} else if (direction === 'left') {
			return lookPastFloor(i, j - 1, seats, direction);
		} else if (direction === 'topMinor') {
			return lookPastFloor(i - 1, j + 1, seats, direction);
		} else if (direction === 'bottomMajor') {
			return lookPastFloor(i + 1, j + 1, seats, direction);
		} else if (direction === 'bottomMinor') {
			return lookPastFloor(i + 1, j - 1, seats, direction);
		}
	} else {
		// otherwise if empty pass false
		return false;
	}
};
