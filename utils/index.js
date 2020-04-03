// UTILITY FUNCTIONS

const utils = {};

utils.getInitials = str => {
  let words = str.split(" ");

  let initials = words.map(word => word.slice(0, 1).toUpperCase());

  return initials.join("");
};

utils.makeObjectFromArray = input => {
  // INPUT arguments
  //   - A 1-dimensional array of key names followed by their values
  //     - example: ['name', 'R2-D2', 'home_planet', 'Tatooine']
  //
  // RETURN value
  //   - An object whose keys are the odd elements of the input array and whose values are the even elements of the input array
  //     - example: {name: 'R2-D2', home_planet: 'Tatooine'}
  //
  //your code here
  let result = {};

  for (let i = 0; i < input.length; i++) {
    if (i % 2 === 0) {
      result[input[i]] = "";
    } else {
      result[input[i - 1]] = input[i];
    }
  }
  return result;
};

utils.generateGroups = (arr, size) => {
  // INPUT arguments
  //   - A 1-dimensional array
  //   - The length of each subgroup that should be created
  //
  // RETURN value
  //   - A 2-dimensional array of arrays. Each subarray should be as long as the length argument passed in to the function, except for the final subarray, which can be shorter and contain a "remainder" smaller than that length.
  //
  //your code here
  let result = [];

  while (arr.length) {
    let subArr = [];

    for (let i = 0; i < size; i++) {
      if (arr.length !== 0) {
        subArr.push(arr.shift());
      }
    }

    result.push(subArr);
    subArr = [];
  }

  return result;
};

module.exports = utils;
