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
	const rotations = [
		['L', 90],
		['L', 90],
		['L', 90],
		['L', 90],
	];

	console.log(ship);
	navigationOrders.forEach((action) => {
		ship.waypointNavigation(action);
		console.log(ship);
	});
	console.log(ship);
	console.log(ship.getManhattan());
});

class Ship {
	degrees = 0;
	direction = 'east';
	east = 0;
	north = 0;
	coordinates = [10, 1];

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

	rotateWaypoint(action) {
		let [rotation, degrees] = action;
		const [x, y] = this.coordinates;

		degrees = degrees % 360;

		if (rotation === 'L') {
			switch (degrees) {
				case 90:
					return (this.coordinates = [-y, x]);
				case 180:
					return (this.coordinates = [-x, -y]);
				case 270:
					return (this.coordinates = [y, -x]);
			}
		} else {
			switch (degrees) {
				case 90:
					return (this.coordinates = [y, -x]);
				case 180:
					return (this.coordinates = [-x, -y]);
				case 270:
					return (this.coordinates = [-y, x]);
			}
		}
	}

	calculateForward(multiplier) {
		const [x, y] = this.coordinates;

		this.east += x * multiplier;
		this.north += y * multiplier;
	}

	waypointNavigation(action) {
		const [order, units] = action;
		const [x, y] = this.coordinates;

		switch (order) {
			case 'N':
				return (this.coordinates = [x, y + units]);
			case 'S':
				return (this.coordinates = [x, y - units]);
			case 'E':
				return (this.coordinates = [x + units, y]);
			case 'W':
				return (this.coordinates = [x - units, y]);
			case 'F':
				return this.calculateForward(units);
			case 'R':
				return this.rotateWaypoint(action);
			case 'L':
				return this.rotateWaypoint(action);
			default:
				return console.log('unhandled case');
		}
	}
}

const directShip = (ship, action) => {};
