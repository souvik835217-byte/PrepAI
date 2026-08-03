export default function pythonDriver(code, config, test) {
  return `
${code}

nums=${JSON.stringify(test.input.nums)}

sol=Solution()

ans=sol.${config.functionName}(nums)

print(*ans)
`;
}
