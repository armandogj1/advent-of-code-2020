const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const instructions = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const clean = line.trim();
	instructions.push(clean);
});

lineReader.on('close', () => {
	// run function
	const instTupple = formatInstructions(instructions);
	console.log(checkTimes(instTupple[0], instTupple[1]));

	const partTwoInst = partTwoFormat(instructions);
	console.log(partTwoInst);
	console.log(contiguousBusTimes(partTwoInst));
	// console.log(findFirstTimeOfFirstBus(1000417, 23));
});

const formatInstructions = (inst) => {
	let [timeStamp, busses] = inst;

	// make proper type
	timeStamp = Number(timeStamp);
	busses = busses.split(',').filter((bus) => {
		return bus !== 'x';
	});

	return [timeStamp, busses];
};

const isBusBack = (currTime, busId) => {
	const isBack = currTime % busId;

	if (isBack !== 0) return false;

	return true;
};

const checkTimes = (timeStamp, busses) => {
	let departureTime = timeStamp;
	let busToTake = null;

	while (!busToTake) {
		busses.forEach((bus) => {
			if (isBusBack(departureTime, bus) && !busToTake) {
				busToTake = bus;
				console.log('busFound', bus, departureTime);
			}
		});

		if (busToTake) break;
		departureTime += 1;
	}

	return busToTake * (departureTime - timeStamp);
};

const partTwoFormat = (inst) => {
	const [time, ...busses] = inst;

	return [Number(time), busses[0].split(',')];
};

const contiguousBusTimes = (inst) => {
	let [time, busses] = inst;
	let currBus = 0;

	// get first time for first bus
	let timeFirstBus = findFirstTimeOfFirstBus(time, busses[0]);
	let currTime = timeFirstBus;

	while (currBus < busses.length) {
		// if current bus is present or no bus at current time
		if (busses[currBus] === 'x' || currTime % busses[currBus] === 0) {
			// increment currbus and time
			currBus += 1;
			currTime += 1;
		} else {
			// otherwise keep currtime and start back at zero
			currBus = 0;
			timeFirstBus += Number(busses[0]);
			currTime = timeFirstBus;
		}
	}

	// return time minus the number of busses
	return timeFirstBus;
	// return timeFirstBus;
};

const findFirstTimeOfFirstBus = (timeStamp, bus) => {
	bus = Number(bus);

	return timeStamp + (23 - (timeStamp % bus));
};
