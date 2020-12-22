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

	const allPerms = generateStrings(ruleMap, ruleMap.get('0'));
	const uniquePerms = generateSet(allPerms);
	console.log(uniquePerms.size);

	console.log(messages.length);
	const validMessages = messages.filter((msg) => uniquePerms.has(msg));
	console.log(validMessages.length);
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
const generateSet = (arr) => new Set(arr);

const formatRules = (str) => {
	const [idx, rule] = str.split(': ');

	if (rule[0] === '"') {
		return [idx, rule.slice(1, rule.length - 1)];
	}

	// const reg = /\|/;
	// if (!reg.test(rule)) {
	// 	return [idx, rule.trim().split(' ')];
	// }

	return [idx, rule.split('|').map((s) => s.trim().split(' '))];
};

const generateStrings = (rules, rule, messages = '') => {
	// create a bucket
	return rule.flatMap((ruleSet) => {
		let strings = [messages];
		// iterate over the rule
		for (let i = 0; i < ruleSet.length; i++) {
			// call generate on current inner rule
			const currRule = rules.get(ruleSet[i]);

			if (typeof currRule === 'string') {
				strings = strings.map((valid) => valid + currRule);
			} else if (currRule) {
				strings = strings.flatMap((msgs) => {
					const test = generateStrings(rules, currRule, msgs);

					return test;
				});
			} else {
				strings = strings.flatMap((msgs) =>
					generateStrings(rules, ruleSet[i], msgs)
				);
			}

			if (strings.length === 0) {
				return false;
			}
		}
		return strings;
	});
};

const flatten = (arr) => {
	return arr.map((cur) => {
		if (Array.isArray(cur)) {
			return flatten(cur);
		}
		return cur;
	});
};
