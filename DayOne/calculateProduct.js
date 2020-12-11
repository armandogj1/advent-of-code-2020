const readline = require('readline');
const { createReadStream } = require('fs');

const numbers = [];
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const cleanLine = line.trim();
	numbers.push(Number(cleanLine));
});

lineReader.on('close', () => {
	// console.log(numbers);
	console.log(calculateReport(numbers));
	console.log(findThreeValues(numbers));
});

const calculateReport = (nums) => {
	const numsSet = new Set(nums);

	for (let currNum of numsSet.values()) {
		const second = 2020 - currNum;

		if (numsSet.has(second)) {
			return currNum * second;
		}
	}

	return null;
};

const findThreeValues = (nums) => {
	const numsSet = new Set(nums);

	for (let i = 0; i < nums.length; i++) {
		for (let j = 0; j < nums.length; j++) {
			if (i !== j) {
				const first = nums[i];
				const second = nums[j];
				const third = 2020 - first - second;

				if (numsSet.has(third)) {
					return first * second * third;
				}
			}
		}
	}

	return null;
};
