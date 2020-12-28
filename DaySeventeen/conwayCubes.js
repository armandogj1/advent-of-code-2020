const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const rl = createInterface({
  input: createReadStream('input.txt'),
});

let cube = [];

rl.on('line', (line) => {
  const cleanLine = line.trim().split('');
  cube.push(cleanLine);
});

rl.on('close', () => {
  //
  const cub = [
    [
      ['.', '.'],
      ['.', '.'],
    ],
    [
      ['.', '#'],
      ['.', '.'],
    ],
  ];

  console.log(cube);

  const newC = expandCube(cub);
  console.log(newC);
});

const expandCube = (cube) => {
  const expanded = cube.map((layer) => {
    const newLayer = layer.map((row) => {
      const newRow = row.slice();
      newRow.unshift('.');
      newRow.push('.');
      return newRow;
    });
    const length = newLayer[0].length;
    newLayer.unshift(Array(length).fill('.'));
    newLayer.push(Array(length).fill('.'));
    return newLayer;
  });

  const top = expanded[0].map((row) => {
    return row.map((pos) => '.');
  });

  const bottom = expanded[0].map((row) => {
    return row.map((pos) => '.');
  });

  expanded.unshift(top);
  expanded.push(bottom);

  return expanded;
};

const generateCube = (layer) => {
  const length = layer.length;

  const cube = layer.map((row) => {
    return row.map((r) => Array(length).fill('.'));
  });
};
