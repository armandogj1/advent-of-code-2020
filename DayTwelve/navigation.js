const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const navigationOrders = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const clean = line.trim();
	const action = [clean[0], Number(clean.slice(1))];

	navigationOrders.push(action);
});

lineReader.on('close', () => {
	// run function

	const ship = new Ship();

	console.log(ship);
	navigationOrders.forEach((action) => {
		ship.applyAction(action);
	});

	console.log(ship.getManhattan());
});

class Ship {
	degrees = 0;
	direction = 'east';
	east = 0;
	north = 0;

	applyAction(action) {
		const [direction, units] = action;

		switch (direction) {
			case 'F':
				return this.handleForward(units);
			case 'N':
				return (this.north += units);
			case 'S':
				return (this.north -= units);
			case 'W':
				return (this.east -= units);
			case 'E':
				return (this.east += units);
			case 'L':
				return this.rotateShip(-units);
			case 'R':
				return this.rotateShip(units);
			default:
				return console.log(action);
		}
	}

	rotateShip(degrees) {
		const newDegrees = (this.degrees + degrees) % 360;

		if (newDegrees < 0) {
			if (newDegrees === -90) {
				this.degrees = 270;
			}

			if (newDegrees === -180) {
				this.degrees = 180;
			}

			if (newDegrees === -270) {
				this.degrees = 90;
			}
		} else if (newDegrees === 0) {
			this.degrees = Math.abs(newDegrees);
		} else {
			this.degrees = newDegrees;
		}

		if (this.degrees === 0 || this.degrees === 180) {
			this.direction = 'east';
		} else {
			this.direction = 'north';
		}
	}

	handleForward(units) {
		if (this.degrees === 90 || this.degrees === 180) {
			this[this.direction] -= units;
		} else {
			this[this.direction] += units;
		}
	}

	getManhattan() {
		return Math.abs(this.north) + Math.abs(this.east);
	}
}

const directShip = (ship, action) => {};
