const readline = require('readline');
const { createReadStream } = require('fs');

let currGroup = '';
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const cleanLine = line.trim();
	currGroup += cleanLine + ' ';

	if (line.length === 0) {
		currGroup += '\n';
	}
});

lineReader.on('close', () => {
	// run function
	const groups = currGroup.split('\n');
	console.log('|' + groups[groups.length - 1].trim() + '|');

	const total = countAllAnswers(groups);
	console.log(total);
	// console.log(repeatedAnswerInGroup(groups[0]));
});

// count of unique chars from curr group
const NumUniqueAnswers = (groupAnswer) => {
	const unique = new Set(groupAnswer);
	return unique.size;
};

// count total of answers
const countAllAnswers = (groups) => {
	let count = 0;

	groups.forEach((group) => {
		const answers = repeatedAnswerInGroup(group);

		count += answers;
	});

	return count;
};

// find repeated questions
const repeatedAnswerInGroup = (group) => {
	// split the group by person
	const answers = group
		.trim()
		.split(' ')
		.sort((a, b) => a.length - b.length);
	// make set from the smallest answers
	const validAnswers = new Set(answers[0]);
	// iterate over all groups
	answers.forEach((current) => {
		// if current is missing one from smallest
		const currSet = new Set(current);

		validAnswers.forEach((ans) => {
			if (!currSet.has(ans)) {
				// remove from smallest
				validAnswers.delete(ans);
			}
		});
	});
	// return size of set
	return validAnswers.size;
};
