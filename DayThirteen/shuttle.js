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

	console.log(contiguousBusTimes(partTwoInst));

	const busTimes = getValuesForBusTimes(partTwoInst[1]);
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
	let busTimeDifferences = getValuesForBusTimes(busses);
	let timeFirstBus = calculateProductOfBusTimes(
		busTimeDifferences,
		Number(busses[0])
	);

	return timeFirstBus;
};

const findFirstTimeOfFirstBus = (timeStamp, bus) => {
	bus = Number(bus);

	return timeStamp + (23 - (timeStamp % bus));
};

const getValuesForBusTimes = (busses) => {
	const busTimes = {};

	busses.forEach((bus, idx) => {
		if (bus !== 'x') {
			busTimes[bus] = idx;
		}
	});

	return busTimes;
};

const checkAllBusTimes = (time, busTimes) => {
	let isValid = true;

	Object.entries(busTimes).forEach(([bus, timeDif]) => {
		if ((time + timeDif) % Number(bus) > 0) {
			isValid = false;
		}
	});

	return isValid;
};

const calculateProductOfBusTimes = (busTimes, startNum) => {
	let lcd = startNum;
	return Object.entries(busTimes)
		.sort((a, b) => {
			return b[1] - a[1];
		})
		.reduce((time, [bus, offset]) => {
			if (offset !== 0) {
				while ((time + offset) % Number(bus) !== 0) {
					time += lcd;
				}
				lcd = lcd * Number(bus);
			}

			return time;
		}, startNum);
};
