const readline = require('readline');
const { createReadStream } = require('fs');

const passports = [];
const fileStream = createReadStream('./input.txt');
let currPass = '';

const lineReader = readline.createInterface({
	input: fileStream,
});

lineReader.on('line', (line) => {
	// if (line.length === 0) {
	// 	passports.push(currPass);
	// 	currPass = '';
	// } else {
	// 	const cleanLine = ' ' + line.trim();
	// 	currPass += cleanLine;
	// }
	if (line.length === 0) {
		currPass = currPass.concat('\n');
	} else {
		const spaced = ' ' + line;
		currPass = currPass.concat(spaced);
	}
});

lineReader.on('close', () => {
	const array = currPass.split('\n');
	console.log(array);
	console.log('Valid passports:', passportsValidator(array));
});

const passportCreator = (pass) => {
	const splitPass = pass.trim().split(' ');
	const passMap = new Map();

	splitPass.forEach((field) => {
		const [key, value] = field.split(':');
		passMap.set(key, value);
	});

	return passMap;
};

const isPassportValid = (passport) => {
	// byr (Birth Year) - four digits; at least 1920 and at most 2002.
	const byr = Number(passport.get('byr'));
	if (byr < 1920 || byr > 2002 || isNaN(byr)) return false;

	// iyr (Issue Year) - four digits; at least 2010 and at most 2020.
	const iyr = Number(passport.get('iyr'));
	if (iyr < 2010 || iyr > 2020 || isNaN(iyr)) return false;

	// eyr (Expiration Year) - four digits; at least 2020 and at most 2030.
	const eyr = Number(passport.get('eyr'));
	if (eyr < 2020 || eyr > 2030 || isNaN(eyr)) return false;

	// hgt (Height) - a number followed by either cm or in:
	// If cm, the number must be at least 150 and at most 193.
	// If in, the number must be at least 59 and at most 76.
	const height = passport.get('hgt') || '';
	const hgt = Number(height.slice(0, height.length - 2));
	const system = height.slice(height.length - 2);
	if (system === 'in') {
		if (hgt < 59 || hgt > 76 || isNaN(hgt)) return false;
	} else if (system === 'cm') {
		if (hgt < 150 || hgt > 193 || isNaN(hgt)) return false;
	} else {
		return false;
	}

	// hcl (Hair Color) - a # followed by exactly six characters 0-9 or a-f.
	const hcl = passport.get('hcl');
	const regex = /^#(?=[0-9a-f]{6}$)/;
	if (!regex.test(hcl)) return false;

	// ecl (Eye Color) - exactly one of: amb blu brn gry grn hzl oth.
	const ecl = passport.get('ecl');
	const colors = {
		amb: true,
		blu: true,
		brn: true,
		gry: true,
		grn: true,
		hzl: true,
		oth: true,
	};
	if (!colors[ecl]) return false;

	// pid (Passport ID) - a nine-digit number, including leading zeroes.
	const pid = passport.get('pid');
	const validPid = /^(?=[0-9]{9}$)/;
	if (!validPid.test(pid)) return false;
	// cid (Country ID) - ignored, missing or not.

	return true;
};

const passportsValidator = (passportsArr) => {
	let validCount = 0;
	const passes = [];
	const fails = [];

	passportsArr.forEach((passport) => {
		const passMap = passportCreator(passport);

		if (isPassportValid(passMap)) {
			validCount += 1;
			passes.push(passMap);
		} else {
			fails.push(passMap);
		}
	});

	console.log('original', passportsArr.length);
	console.log('passing', passes.length);
	console.log('failing', fails.length);
	return validCount;
};
