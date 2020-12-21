const readline = require('readline');
const { createReadStream } = require('fs');

// define the storage
const rules = [];
const messages = [];
let rulesOrMessages = rules;

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// get each instruction
	const cleanLine = cleanStr(line);

	if (!cleanLine.length) {
		rulesOrMessages = messages;
	} else {
		rulesOrMessages.push(cleanLine);
	}
});

lineReader.on('close', () => {
	// run function
	const ruleMap = generateMap(rules);
	console.log(ruleMap, messages);
	const count = checkCharsWithRules(ruleMap, ruleMap.get(0), []);
	console.log(JSON.stringify(count));
});

const cleanStr = (str) => {
	const clean = str.trim();
	const digit = /\d/;

	if (digit.test(clean[0])) {
		return formatRules(clean);
	}
	return clean;
};

const generateMap = (arr) => new Map(arr.entries());

const formatRules = (str) => {
	const split = str.split(': ')[1];

	if (split[0] === '"') {
		return split.slice(1, split.length - 1);
	}

	const reg = /\|/;
	if (!reg.test(split)) {
		return split.trim().split(' ');
	}

	return split.split('|').map((s) => s.trim().split(' '));
};

const checkCharsWithRules = (rules, rule, string) => {
	// if (string.length === 0) return 1;

	if (typeof rules.get(+rule) === 'string') {
		return rule;
	} else {
		const innerRule = rules.get(+rule);

		innerRule.forEach((inner) => {
			checkCharsWithRules(rules, innerRule, string);
		});
	}

	let strings = [];
	for (let i = 0; i < rule.length; i++) {
		// current rule
		const currRule = rule[i];

		if (Array.isArray(currRule)) {
			// if not string get rule from map
			// call check on the array with a new set
			currRule.forEach((inner) => {
				const letterSet = checkCharsWithRules(rules, inner, []);
				memo.push(letterSet);
			});
			// add set to validStrings
		} else {
			const innerRule = rules.get(+currRule);

			const letterSet = checkCharsWithRules(rules, innerRule, []);
			console.log('this is before add', letterSet);
			memo.push(letterSet);
		}
		// if current is a char
		// add set to validStrings
	}

	return memo;
};

// const generatePermutations = (set, string) => {
// 	const strings = set.;

// 	for (let i = 1; i < set.length; i++) {

// 	}
// };
