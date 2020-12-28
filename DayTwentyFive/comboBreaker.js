const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const rl = createInterface({
  input: createReadStream('input.txt'),
});

const keys = [];

rl.on('line', (line) => {
  const num = Number(line);
  keys.push(num);
});

rl.on('close', () => {
  console.log(keys);

  const cardKey = findLoop(keys[0]);
  const doorKey = findLoop(keys[1]);
  console.log(cardKey);
  console.log(doorKey);

  // console.log(applyLoop(17807724, 8, 1));
  const encryptionCard = applyLoop(keys[0], doorKey);
  const encryptionDoor = applyLoop(keys[1], cardKey);

  console.log(encryptionCard === encryptionDoor);
  console.log(encryptionDoor);
});

const findLoop = (key) => {
  let loop = 0;
  let currVal = 1;
  while (currVal !== key) {
    currVal = currVal * 7;
    currVal = currVal % 20201227;
    loop += 1;
  }

  return loop;
};

// const applyLoop = (num, loop, curr = 1) => {
//   if (loop === 0) {
//     return curr;
//   }

//   let newNum = num * curr;
//   newNum = newNum % 20201227;

//   return applyLoop(num, loop - 1, newNum);
// };

const applyLoop = (num, loop) => {
  let result = 1;

  while (loop !== 0) {
    result *= num;
    result = result % 20201227;
    loop -= 1;
  }
  return result;
};
