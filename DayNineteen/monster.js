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

	const count = generateStrings(ruleMap, ruleMap.get('0'));
	console.log(count);
});

const cleanStr = (str) => {
	const clean = str.trim();
	const digit = /\d/;

	if (digit.test(clean[0])) {
		return formatRules(clean);
	}
	return clean;
};

const generateMap = (arr) => new Map(arr);

const formatRules = (str) => {
	const [idx, rule] = str.split(': ');

	if (rule[0] === '"') {
		return [idx, rule.slice(1, rule.length - 1)];
	}

	const reg = /\|/;
	if (!reg.test(rule)) {
		return [idx, rule.trim().split(' ')];
	}

	return [idx, rule.split('|').map((s) => s.trim().split(' '))];
};

const generateStrings = (rules, rule, string = '') => {
	// if rule is a string
	if (typeof rule === 'string') {
		const currRule = rules.get(rule);
		if (Array.isArray(currRule)) {
			return generateStrings(rules, currRule);
		} else if (typeof currRule === 'string') {
			return currRule;
		} else {
			return;
		}
	}

	// create a bucket
	let bucket = [];
	// iterate over the rule
	for (let i = 0; i < rule.length; i++) {
		// call generate on current inner rule
		const curr = generateStrings(rules, rule[i]);
		if (bucket.length === 0) {
			bucket = bucket.concat(curr);
		} else {
			bucket.forEach((val, idx) => {
				bucket[idx] = bucket[idx].concat(curr);
			});
		}
	}
	// take the returned value and add it to the values in the bucket

	// return the bucket
	return bucket;
};

const flatten = (arr) => {
	return arr.map((cur) => {
		if (Array.isArray(cur)) {
			return flatten(cur);
		}
		return cur;
	});
};

[
	['a'],
	[
		[
			[
				[['a'], ['a']],
				[['b'], ['b']],
			],
			[
				[['a'], ['b']],
				[['b'], ['a']],
			],
		],
		[
			[
				[['a'], ['b']],
				[['b'], ['a']],
			],
			[
				[['a'], ['a']],
				[['b'], ['b']],
			],
		],
	],
	['b'],
];
