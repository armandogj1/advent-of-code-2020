const readline = require('readline');
const { createReadStream } = require('fs');

const instructions = [];
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const cleanLine = line.trim();

	if (cleanLine.length > 0) {
		const [type, value] = cleanLine.split(' ');

		instructions.push([type, Number(value)]);
	}
});

lineReader.on('close', () => {
	// run function

	// console.log(instructions);
	// console.log(findFirstRepeat(instructions));
	// console.log('new result after mod', findFirstRepeat(instructions));
	console.log(checkAllToggles(instructions));
});

const findFirstRepeat = (orders) => {
	// initialize pointer
	let i = 0;
	let acc = 0;
	let lastAdded;

	// called functions map
	let alreadyCalled = new Set();

	while (i < orders.length) {
		// console.log(orders[i], i);
		const type = orders[i][0];
		const offset = orders[i][1];

		if (alreadyCalled.has(orders[i])) {
			// restart loop
			// if lastToggled empty

			return false;
		}

		lastAdded = orders[i];

		if (type === 'jmp') {
			alreadyCalled.add(orders[i]);
			i += offset;
		}

		if (type === 'acc') {
			alreadyCalled.add(orders[i]);
			acc += offset;
			i += 1;
		}

		if (type === 'nop') {
			alreadyCalled.add(orders[i]);
			i += 1;
		}
	}

	console.log('prior', lastAdded);
	console.log('current', orders[i]);
	return acc;
};

const jumpNopModifier = (prior) => {
	if (prior[0] === 'jmp') {
		prior[0] = 'nop';
	} else if (prior[0] === 'nop') {
		prior[0] = 'jmp';
	}
};

const checkAllToggles = (instructs) => {
	const toggleables = [];
	instructs.forEach((order) => {
		if (order[0] === 'jmp' || order[0] === 'nop') {
			toggleables.push(order);
		}
	});

	return toggleables.reduce((acc, toggle) => {
		jumpNopModifier(toggle);
		const result = findFirstRepeat(instructs);
		jumpNopModifier(toggle);
		if (result) {
			acc = result;
		}
		return acc;
	}, false);
};
