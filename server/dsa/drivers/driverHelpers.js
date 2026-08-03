export const assertSupportedSignature = (config) => {
  const parameter = config.parameters?.[0];

  if (
    config.driverType !== "function" ||
    config.returnType !== "vector<int>" ||
    config.parameters?.length !== 1 ||
    parameter?.type !== "vector<int>"
  ) {
    throw new Error(
      `Unsupported testcase manifest signature for ${config.id}`
    );
  }

  return parameter;
};
