const { createReadStream } = require('fs');
const { createInterface } = require('readline');

const rl = createInterface({
  input: createReadStream('input.txt'),
});

const foods = [];

rl.on('line', (line) => {
  const food = createFoodObj(line);
  foods.push(food);
});

rl.on('close', () => {
  //
  // console.log(foods);
  const map = tallyIngredientsInAllergen(foods);
  // console.log(map);

  const ingOccurences = countOccurence(foods);
  console.log(calculateTotal(ingOccurences));

  const algOccurences = filterAllergens(map);
  // console.log(algOccurences);

  const matches = findAllergenMatch(algOccurences);
  // console.log(matches);

  const safeIngs = removeAllergens(ingOccurences, matches);
  // console.log(safeIngs);
  console.log(calculateTotal(safeIngs));
  console.log(matches);
  console.log(sortAllergens(matches));
});

const createFoodObj = (line) => {
  const allergenRegex = /\((.*)\)/;
  const match = line.trim().match(allergenRegex);
  let allergens = [];

  if (match) {
    const [capture, relatedString] = match;
    const [contains, ...algs] = relatedString.split(/ |, /);
    allergens = algs;
  }

  let [ingredients, rest] = line.trim().split('(');
  ingredients = ingredients.trim().split(' ');

  return { ingredients, allergens };
};

const tallyIngredientsInAllergen = (foods) => {
  const allergensMap = new Map();

  foods.forEach(({ ingredients, allergens }) => {
    allergens.forEach((alg) => {
      if (!allergensMap.has(alg)) {
        allergensMap.set(alg, new Map());
      }

      const algMap = allergensMap.get(alg);

      ingredients.forEach((ing) => {
        if (!algMap.has(ing)) {
          algMap.set(ing, 0);
        }

        algMap.set(ing, algMap.get(ing) + 1);
      });
    });
  });

  return allergensMap;
};

const countOccurence = (foods) => {
  const ingOccurence = new Map();

  foods.forEach(({ ingredients, foods }) => {
    ingredients.forEach((ing) => {
      if (!ingOccurence.has(ing)) {
        ingOccurence.set(ing, 0);
      }
      ingOccurence.set(ing, ingOccurence.get(ing) + 1);
    });
  });

  return ingOccurence;
};

const countAllergenOccurence = (foods) => {
  const algOccurence = new Map();

  foods.forEach(({ ingredients, allergens }) => {
    allergens.forEach((alg) => {
      if (!algOccurence.has(alg)) {
        algOccurence.set(alg, 0);
      }
      algOccurence.set(alg, algOccurence.get(alg) + 1);
    });
  });

  return algOccurence;
};

// find the high occuring ingredient that is unique
const reduceMap = (map) => {
  const entries = [];

  map.forEach((count, ingredient) => {
    entries.push([ingredient, count]);
  });

  entries.sort((a, b) => b[1] - a[1]);
  const maxCount = entries[0][1];

  return entries.filter((ing) => maxCount === ing[1]);
};

// once highest counts have been filtered
// loop through all filtered and find those with a single value
// add those to a map as the allergen
//

const filterAllergens = (allergens) => {
  const uniqueAlgs = [...allergens];

  uniqueAlgs.forEach(([key, ings], idx) => {
    uniqueAlgs[idx][1] = reduceMap(ings);
    // console.log(uniqueAlgs[idx][1]);
  });

  return uniqueAlgs;
};

const findAllergenMatch = (filtered) => {
  const matched = new Map();
  const added = new Set();
  let idx = 0;
  let count = 0;

  while (filtered.length > 0) {
    // console.log(idx, filtered.length);
    const [alg, ings] = filtered[idx];

    if (ings.length === 1) {
      matched.set(alg, ings[0][0]);
      added.add(ings[0][0]);
      filtered.splice(idx, 1);
    } else if (ings.length > 1) {
      filtered[idx][1] = ings.filter((ing) => !added.has(ing[0]));
    }

    idx += 1;

    if (idx >= filtered.length) {
      idx = 0;
    }

    count += 1;
  }

  return matched;
};

const removeAllergens = (ings, allergens) => {
  allergens.forEach((ingredient, alg) => {
    ings.delete(ingredient);
  });

  return ings;
};

const calculateTotal = (ings) => {
  let total = 0;

  ings.forEach((count, ing) => {
    total += count;
  });

  return total;
};

const sortAllergens = (algs) => {
  const entries = [...algs].sort((a, b) => {
    if (a[0] < b[0]) return -1;

    return 1;
  });

  return entries.map((tupple) => tupple[1]).join(',');
};
