'use strict';

const readline = require('readline');
const { createReadStream } = require('fs');

let instructions = '';

const fileStream = createReadStream('./input.txt');

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	if (line.length === 0) {
		line += '--';
	}
	instructions = instructions.concat(line + '\n');
});

lineReader.on('close', () => {
	//
	const insts = formatInstructions(instructions);

	// const testFirstTicket = areFieldsInvalid(insts.rules, insts.otherTickets[1]);
	// console.log(getInvalidFields(testFirstTicket));

	// console.log(getErrorSum(insts));
	const tix = getValidSum(insts);

	// const rangesForAllFields = generaterRangesForAllFields(insts.rules, tix[0]);
	// console.log(rangesForAllFields[0].size);
	// console.log(checkRangesForField(489, rangesForAllFields[0]));
	// console.log(checkRangesForField(224, rangesForAllFields[0]));
	// console.log(rangesForAllFields[0].size);
	const mytixsplit = insts.myTicket.split(',');
	const mytix = mytixsplit.reduce((acc, field) => {
		acc.set(field, false);
		return acc;
	}, new Map());

	const validTix = onlyValidTix(tix);
	console.log(validTix.length);
	validTix.push(mytix);
	console.log(validTix.length);
	// console.log(validTix);
	const test = checkAllFieldsForAllRanges(validTix, insts.rules);
	let i = 0;
	test.forEach((fieldRange, key) => {
		console.log(fieldRange.size);
		console.log(i++);
	});
});

const formatInstructions = (insts) => {
	let [rules, myTicket, otherTickets] = insts.split('--\n');
	rules = formatRules(rules.trim().split('\n'));
	myTicket = myTicket.trim().split('\n')[1];
	otherTickets = otherTickets.trim().split('\n').slice(1);

	return { rules, myTicket, otherTickets };
};

const formatRules = (rules) => {
	const map = new Map();

	rules.forEach((rule) => {
		let [type, ranges] = rule.split(': ');
		ranges = ranges.split(' or ');
		ranges = ranges.map((range) => {
			range = range.trim().split('-');
			return range;
		});

		map.set(type, ranges);
	});

	return map;
};

const areFieldsInvalid = (rules, ticket) => {
	const invalid = new Map();
	ticket = ticket.split(',');

	rules.forEach((values, key) => {
		let [min, max] = values;
		for (let i = 0; i < ticket.length; i++) {
			const curr = Number(ticket[i]);

			const firstRange = curr < Number(min[0]) || curr > Number(min[1]);
			const secondRange = curr < Number(max[0]) || curr > Number(max[1]);

			if (firstRange && secondRange) {
				if (invalid.get(curr) !== false) {
					invalid.set(curr, true);
				}
			} else {
				invalid.set(curr, false);
			}
		}
	});

	return invalid;
};

const getInvalidFields = (fields) => {
	return Object.entries(fields).reduce((acc, [key, value]) => {
		if (value) {
			acc.push(Number(key));
		}
		return acc;
	}, []);
};

const applyToAll = (validator, extract) => {
	return (values, rules) => {
		return values.map((value) => {
			return extract(validator(rules, value));
		});
	};
};

const getAllInvalidTickets = applyToAll(areFieldsInvalid, getInvalidFields);

const reduceFromInsts = (getAll) => {
	return (insts) => {
		const all = getAll(insts.otherTickets, insts.rules);

		return all.reduce((acc, value) => {
			const currCount = value.reduce((acc, val) => acc + val, 0);
			return acc + currCount;
		}, 0);
	};
};

const getErrorSum = reduceFromInsts(getAllInvalidTickets);

const getValidField = (fields) => {
	const notValid = Object.entries(fields).reduce((acc, [key, value]) => {
		if (value) {
			acc = true;
		}
		return acc;
	}, false);

	return notValid ? {} : fields;
};

const provideValid = (getAll) => {
	return (insts) => {
		const all = getAll(insts.otherTickets, insts.rules);

		return all;
	};
};

const getAllValidTickets = applyToAll(areFieldsInvalid, getValidField);

const getValidSum = provideValid(getAllValidTickets);

const generaterRangesForAllFields = (rules, validTicket) => {
	const rulesForEachField = [];

	validTicket.forEach((range, key) => {
		const newRules = new Map(rules);

		rulesForEachField.push(newRules);
	});

	return rulesForEachField;
};

const isRangeValid = (field, range) => {
	const [min, max] = range;

	const firstRange = field >= Number(min[0]) && field <= Number(min[1]);
	const secondRange = field >= Number(max[0]) && field <= Number(max[1]);

	// console.log(
	// 	'this is currfield: ',
	// 	field,
	// 	'range: ',
	// 	range,
	// 	firstRange || secondRange
	// );
	return firstRange || secondRange;
};

const checkRangesForField = (field, ranges) => {
	ranges.forEach((range, key) => {
		// console.log(!isRangeValid(field, range), field, key, range);
		if (!isRangeValid(field, range)) {
			console.log(field, range);
			ranges.delete(key);
		}
	});
};

// call checkRangesForField on all fields in ticket
const checkAllFieldsForAllRanges = (tickets, rules) => {
	const allRangesAllFields = generaterRangesForAllFields(rules, tickets[0]);

	let count = 0;
	const fields = tickets[0];

	tickets.forEach((fields) => {
		let i = 0;
		// if (count < 5) {
		fields.forEach((bool, currField) => {
			const currRangesForField = allRangesAllFields[i];

			checkRangesForField(currField, currRangesForField);
			i += 1;
		});
		// }
		count += 1;
	});

	// console.log(allRangesAllFields);

	// console.log(allRangesAllFields);
	return allRangesAllFields;
};

const onlyValidTix = (tickets) => {
	return tickets.reduce((acc, ticket) => {
		let invalid = false;
		ticket.forEach((bool, field) => {
			if (bool) {
				invalid = bool;
			}
		});
		if (invalid) return acc;
		acc.push(ticket);
		return acc;
	}, []);
};
