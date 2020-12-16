const readline = require('readline');
const { createReadStream } = require('fs');

const instructions = [];
let currInst = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const cleanLine = line.trim();

	if (cleanLine.match(/mask/) && currInst.length) {
		instructions.push(currInst);
		currInst = [];
		currInst.push(cleanLine);
	} else {
		currInst.push(cleanLine);
	}
});

lineReader.on('close', () => {
	// push last instruction
	instructions.push(currInst);

	// call solver
	// const formated = makeInstructions(instructions);
	// // console.log(formated);

	// const result = applyMaskToAll(formated);
	// // console.log(getSum(result));

	const setsToSave = saveValueToAllMasked(instructions);
	const savedValues = saveValuesToMemory(setsToSave);

	const total = calculateSum(savedValues);
	console.log('this is total sum: ', total);
});

const makeInstructions = (insts) => {
	return insts.map((instSet) => {
		let [mask, ...values] = instSet;

		mask = mask.split(' = ')[1];

		return {
			mask,
			values: formatValues(values),
		};
	});
};

const formatValues = (values) => {
	return values.map((value) => {
		let [location, val] = value.split(' = ');
		location = location.split('[')[1].slice(0, -1);
		val = Number(val);
		return [Number(location), intToBinaryPadded(val)];
	});
};

const intToBinaryPadded = (int) => {
	const binary = int.toString(2);

	return binary.padStart(36, 0);
};

const applyMaskToAll = (instructions) => {
	const maskedVals = [];

	instructions.forEach(({ mask, values }) => {
		values.forEach(([idx, val]) => {
			maskedVals[idx] = applyMask(mask, val);
		});
	});

	return maskedVals;
};

const applyMask = (mask, binary) => {
	let modBinary = '';
	for (let i = binary.length - 1; i >= 0; i--) {
		if (mask[i] === 'X') {
			modBinary = binary[i] + modBinary;
		} else {
			modBinary = mask[i] + modBinary;
		}
	}

	return modBinary;
};

const convertToInt = (binaries) => {
	return binaries.reduce((acc, binary) => {
		if (binary) {
			acc.push(parseInt(binary, 2));
		}
		return acc;
	}, []);
};

const getSum = (binaries) => {
	const ints = convertToInt(binaries);

	return ints.reduce((acc, int) => {
		return acc + int;
	}, 0);
};

const generateAllMasks = (mask, permutation, memo) => {
	const options = ['0', '1'];

	if (mask.length === 0) {
		return memo.add(permutation);
	}

	if (mask.length < 0) {
		return;
	}

	const remainder = mask.slice(1);

	if (mask[0] === '1' || mask[0] === '0') {
		let idx = 0;
		let unchangeableValues = '';

		while (idx < mask.length) {
			if (mask[idx] === 'X') {
				break;
			}
			unchangeableValues = unchangeableValues.concat(mask[idx]);
			idx += 1;
		}

		return generateAllMasks(
			mask.slice(idx),
			permutation.concat(unchangeableValues),
			memo
		);
	}

	options.forEach((oneOrZero) => {
		const newPerm = permutation.concat(oneOrZero);
		if (!memo.has(newPerm)) {
			generateAllMasks(remainder, newPerm, memo);
		}
	});

	return memo;
};

const makeInstructionsPartTwo = (insts) => {
	return insts.map((instSet) => {
		let [mask, ...values] = instSet;

		mask = mask.split(' = ')[1];

		return {
			mask,
			values: formatIdx(values),
		};
	});
};

const formatIdx = (values) => {
	return values.map((value) => {
		let [location, val] = value.split(' = ');
		location = Number(location.split('[')[1].slice(0, -1));
		val = Number(val);
		return [location, val];
	});
};

const saveValueToAllMasked = (insts) => {
	const formated = makeInstructionsPartTwo(insts);

	return formated.map(({ mask, values }) => {
		return values.map(([idx, value]) => {
			const newMask = maskCurrId(intToBinaryPadded(idx), mask);

			return {
				id: idx,
				idx: intToBinaryPadded(idx),
				masks: generateAllMasks(newMask, '', new Set()),
				value: value,
			};
		});
	});
};

const saveValuesToMemory = (values) => {
	const results = {};

	values.forEach((curr) => {
		console.log(curr);
		curr.forEach(({ masks, value, idx, id }) => {
			masks.forEach((i) => {
				const index = parseInt(i, 2);
				results[index] = value;
			});
		});
	});

	return results;
};

const maskCurrId = (binary, mask) => {
	let modBinary = '';
	for (let i = binary.length - 1; i >= 0; i--) {
		if (mask[i] === 'X') {
			modBinary = mask[i] + modBinary;
		} else if (mask[i] === '1') {
			modBinary = mask[i] + modBinary;
		} else {
			modBinary = binary[i] + modBinary;
		}
	}

	return modBinary;
};

const calculateSum = (values) => {
	const totals = [];
	Object.entries(values).forEach(([key, value]) => {
		if (value !== undefined) {
			totals.push(value);
		}
	});

	return totals.reduce((acc, value) => {
		return acc + value;
	});
};
