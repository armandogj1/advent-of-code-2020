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
	const count = checkCharsWithRules(ruleMap, messages[2], ruleMap.get(0));
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

const checkCharsWithRules = (rules, string, rule, memo) => {
	// if (string.length === 0) return 1;

	let validLetters = string;

	for (let i = 0; i < rule.length; i++) {
		// get curr rule
		// if it is an array
		if (Array.isArray(rules[i])) {
			const currRule = rule[i];
			// copy string and call check with arr and copy
			const copy = string;

			for (let j = 0; j < currRule.length; j++) {
				const innerRule = rules.get(cuurRule[j]);

				if (typeof innerRule === 'string') {
					if (copy[0] === innerRule) {
						copy = copy.slice(1);
					} else {
						break;
					}
				} else {
					checkCharsWithRules(rules, copy, innerRule);
				}
			}
		} else {
			const currRule = rules.get(rule[i]);
			// otherwise compare rule with current first char
			if (validLetters[0] === currRule) {
				// if match remove from string and continue
				validLetters = validLetters.slice(1);
				console.log(validLetters);
			} else if (Array.isArray(currRule)) {
				const copy = validLetters;
				checkCharsWithRules(rules, validLetters, currRule);
			} else {
				// otherwise break
				break;
			}
		}
	}

	return validLetters;
};
