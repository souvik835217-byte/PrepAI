export default function javascriptDriver(code, config, test) {
  return `
${code}

const nums=${JSON.stringify(test.input.nums)};

const ans=${config.functionName}(nums);

console.log(ans.join(" "));
`;
}
