function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const current_sum = target - nums[i];
    if (current_sum in map) {
      return [map[current_sum], i].sort((a, b) => a - b);
    }
    if (!(nums[i] in map)) {
      map[nums[i]] = i;
    }
  }
}
const test_cases = [
  {
    id: 1,
    input: {
      nums: [2, 7, 11, 15],
      target: 9,
    },
  },
  {
    id: 2,
    input: {
      nums: [3, 2, 4],
      target: 6,
    },
  },
  {
    id: 3,
    input: {
      nums: [3, 3],
      target: 6,
    },
  },
  {
    id: 4,
    input: {
      nums: [1, 2, 3, 4, 5],
      target: 9,
    },
  },
  {
    id: 5,
    input: {
      nums: [0, 4, 3, 0],
      target: 0,
    },
  },
  {
    id: 6,
    input: {
      nums: [-1, -2, -3, -4, -5],
      target: -8,
    },
  },
  {
    id: 7,
    input: {
      nums: [1, 5, 2, 11],
      target: 7,
    },
  },
  {
    id: 8,
    input: {
      nums: [10, 20, 30, 40],
      target: 70,
    },
  },
  {
    id: 9,
    input: {
      nums: [100, 200, 300],
      target: 400,
    },
  },
  {
    id: 10,
    input: {
      nums: [1, 1, 1, 1, 2],
      target: 3,
    },
  },
];

const answers = test_cases.map(({ input: { nums, target } }) =>
  twoSum(nums, target),
);
console.log(JSON.stringify(answers));
