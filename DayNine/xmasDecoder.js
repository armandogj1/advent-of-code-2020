const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const numbers = [];

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const cleanNum = Number(line);

	numbers.push(cleanNum);
});

lineReader.on('close', () => {
	// run function
	const invalid = checkAllNumbs(numbers);
	console.log(invalid);
	console.log(findContiguousSum(invalid, numbers));
});

const evaluateCurrent = (currentNum, section) => {
	const numbers = new Set(section);
	let isPresent = false;

	numbers.forEach((num) => {
		const otherHalf = currentNum - num;
		if (numbers.has(otherHalf) && otherHalf !== num) {
			isPresent = true;
		}
	});

	// console.log('this is current', currentNum);
	// console.log('this is section', section);
	// console.log('this is numbers', numbers);
	return isPresent;
};

const checkAllNumbs = (nums) => {
	// iterate over the array,
	for (let i = 25; i < nums.length; i++) {
		// check current number to prior 25
		const preamble = nums.slice(i - 25, i);
		// if it is not value
		if (!evaluateCurrent(nums[i], preamble)) {
			// return it
			return nums[i];
		}
	}
};

const findContiguousSum = (invalidNum, nums) => {
	// iterate over nums
	for (let i = 0; i < nums.length; i++) {
		let acc = 0;
		// iterate from current
		for (let j = i; j < nums.length; j++) {
			// add to accumulator
			acc += nums[j];
			// if greater stop inner
			if (acc > invalidNum) {
				break;
			}
			// if equal return sum of first and last
			if (acc === invalidNum) {
				const sorted = nums.slice(i, j + 1).sort();
				return sorted[0] + sorted[sorted.length - 1];
			}
		}
	}
};
