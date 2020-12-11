const readline = require('readline');
const { createReadStream } = require('fs');

const bagRules = new Map();
const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	const [key, innerMap] = ruleSplitter(line);
	bagRules.set(key, innerMap);
});

lineReader.on('close', () => {
	// run function
	console.log(bagRules.size);
	// console.log(ruleSplitter(bagRules[0]));
	console.log(checkValidOuter(bagRules, 'shiny gold', new Set()));
	console.log(bagRules.get('shiny gold'));
	let totalBags = findAllTheBags('shiny gold', bagRules, []);
	totalBags = totalBags.reduce((acc, value) => {
		return (acc += value);
	}, 0);
	console.log(totalBags);
});

const ruleSplitter = (rule) => {
	let [outerBag, innerBag] = rule.trim().split('contain');
	outerBag = outerBag.trim().split(' ').slice(0, -1).join(' ');

	splitInners = innerBag.split(',').map((bag) => {
		const temp = bag.trim().split(' ').slice(0, -1);
		const color = temp.slice(1).join(' ');

		return [color, temp[0]];
	});

	innerBag = new Map(splitInners);
	return [outerBag, innerBag];
};

const checkValidOuter = (bags, bagToCheck, arrayOfBags) => {
	let countValid = 0;
	let count = 0;

	bags.forEach((innerBags, key) => {
		if (innerBags.has(bagToCheck)) {
			arrayOfBags.add(key);
			checkValidOuter(bags, key, arrayOfBags);
		}
	});

	return arrayOfBags.size;
};

const findAllTheBags = (bag, allBags, totalBags) => {
	if (allBags.has(bag)) {
		allBags.get(bag).forEach((value, key) => {
			if (value !== 'no') {
				const amount = Number(value);
				totalBags.push(amount);
				for (let i = 0; i < amount; i++) {
					findAllTheBags(key, allBags, totalBags);
				}
			}
		});
	}
	return totalBags;
};
