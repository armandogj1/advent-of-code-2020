'use strict';

const readline = require('readline');
const { createReadStream } = require('fs');

let operations = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	operations.push(line.trim());
});

lineReader.on('close', () => {
	//
	const result = getSumFromAll(operations);
	console.log(result);
	console.log(getProdSumsFromAll(operations));
});

const getOpTotal = (operations, func) => {
	const firstParenthesis = operations.indexOf('(');

	if (firstParenthesis < 0) {
		return func(operations);
	}

	return getOpTotal(matchPars(operations, func), func);
};

const matchPars = (operation, func) => {
	let parCount = null;
	let leftPar = null;
	let rightPar = null;
	let i = 0;

	// find pair
	while (rightPar === null) {
		if (operation[i] === '(') {
			parCount += 1;

			leftPar = i;
		}

		if (operation[i] === ')') {
			parCount -= 1;

			if (rightPar === null) {
				rightPar = i;
			}
		}

		i += 1;
	}

	const inner = operation.slice(leftPar + 1, rightPar);

	return operation
		.slice(0, leftPar)
		.concat(func(inner))
		.concat(operation.slice(rightPar + 1));
};

const leftRightCalc = (ops) => {
	const valsAndOps = ops.split(' ');
	let opType = '+';

	return valsAndOps.reduce((acc, val) => {
		if (val === '*' || val === '+') {
			opType = val;
			return acc;
		}

		if (opType === '+') return acc + Number(val);

		if (opType === '*') return acc * Number(val);
	}, 0);
};

const applyReduce = (func, calc) => {
	return (array) => {
		return array.reduce((acc, val) => {
			val = func(val, calc);

			return acc + val;
		}, 0);
	};
};

const getSumFromAll = applyReduce(getOpTotal, leftRightCalc);

// part two
const addBeforeMult = (op) => {
	op = op.split('*');

	return op.reduce((acc, val) => {
		val = val.split('+');
		val = val.reduce((sum, num) => {
			return sum + Number(num);
		}, 0);

		return acc * val;
	}, 1);
};

const getProdSumsFromAll = applyReduce(getOpTotal, addBeforeMult);
