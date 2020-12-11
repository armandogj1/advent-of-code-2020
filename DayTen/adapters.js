const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const adapters = new Set();

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const cleanNum = Number(line);

	adapters.add(cleanNum);
});

lineReader.on('close', () => {
	// run function
	console.log(adapters);
	console.log(findAdapters(adapters));
	console.log(
		'this is result',
		findAllPossiblePermutations(0, adapters, new Map())
	);
	// firstTen(adapters);
});

const findAdapters = (adapters) => {
	const adapterLeft = new Set(adapters);
	// store for 1 adapter and 3 adapters
	const oneAdapters = new Set();
	const threeAdapters = new Set();
	// current joltage
	let joltage = 0;

	// add the plus 3 of device
	threeAdapters.add('device');
	while (adapterLeft.size > 0) {
		if (adapterLeft.has(joltage + 1)) {
			oneAdapters.add(joltage + 1);
			adapterLeft.delete(joltage + 1);
			joltage += 1;
		} else if (adapterLeft.has(joltage + 2)) {
			adapterLeft.delete(joltage + 2);
			joltage += 2;
		} else if (adapterLeft.has(joltage + 3)) {
			threeAdapters.add(joltage + 3);
			adapterLeft.delete(joltage + 3);
			joltage += 3;
		} else {
			return false;
		}
	}

	console.log(joltage);
	return [
		adapters.size,
		adapterLeft.size,
		oneAdapters.size,
		threeAdapters.size,
	];
};

const findAllPossiblePermutations = (joltage, adapters, memo) => {
	if (joltage !== 0 && !adapters.has(joltage)) {
		return 0;
	}
	// create a counter
	let possibleConnections = 0;
	// if joltage equal 165
	if (joltage === 165) {
		// return one
		return 1;
	}
	// if greater
	if (joltage > 165) {
		// return zero
		return 0;
	}
	console.log('jolts', joltage);
	// for current joltage call it with increment
	for (let i = 1; i < 4; i++) {
		const nextAdapter = joltage + i;
		if (memo.has(nextAdapter)) {
			possibleConnections += memo.get(nextAdapter);
		} else {
			if (adapters.has(nextAdapter)) {
				const countForCurrent = findAllPossiblePermutations(
					nextAdapter,
					adapters,
					memo
				);
				memo.set(nextAdapter, countForCurrent);
				possibleConnections += countForCurrent;
			}
		}
	}

	// return counter
	return possibleConnections;
};

const firstTen = (adapters) => {
	let count = 0;

	while (count < 20) {
		if (adapters.has(count)) {
			console.log(count);
		}
		count += 1;
	}
};
