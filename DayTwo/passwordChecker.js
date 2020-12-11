const readline = require('readline');
const { createReadStream } = require('fs');

const passwords = [];
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const rulesAndPassword = line.trim().split(' ');
	passwords.push(rulesAndPassword);
});

lineReader.on('close', () => {
	console.log(validPasswords(passwords));
	console.log('this is new Policy', newPolicy(passwords));
});

const validPasswords = (passwords) => {
	let validCount = 0;
	passwords.forEach((pass) => {
		if (isValid(pass)) {
			// console.log(pass);
			validCount += 1;
		}
	});

	return validCount;
};

const isValid = (passwordArr) => {
	//  [2-3, s: ,ssvxszrvj]
	let [charLimits, char, password] = passwordArr;
	const charCounts = {};

	charLimits = charLimits.trim().split('-');
	password = password.trim();
	char = char.trim()[0];

	for (let i = 0; i < password.length; i++) {
		const currChar = password[i];
		charCounts[currChar] = charCounts[currChar] + 1 || 1;
	}

	if (
		charCounts[char] >= Number(charLimits[0]) &&
		charCounts[char] <= Number(charLimits[1])
	) {
		return true;
	}

	return false;
};

const newPolicy = (passwordArr) => {
	let validCount = 0;

	passwordArr.forEach((pass) => {
		const [constraint, char, password] = passwordSplitter(pass);
		const [first, second] = constraint;
		if (password[first] === char && password[second] === char) {
		} else if (password[first] === char || password[second] === char) {
			validCount += 1;
		}
	});

	return validCount;
};

const passwordSplitter = (passArr) => {
	//  [2-3, s: ,ssvxszrvj]
	let [constrain, char, password] = passArr;
	const [first, second] = constrain.trim().split('-');

	char = char.trim()[0];
	password = password.trim();

	return [[Number(first) - 1, Number(second) - 1], char, password];
};
