import { assertSupportedSignature } from "./driverHelpers.js";

export default function javaDriver(userCode, config, testCase) {
  const parameter = assertSupportedSignature(config);
  const values = testCase.input[parameter.name];

  return `${userCode}

class Main {
    public static void main(String[] args) {
        int[] ${parameter.name} = new int[]{${values.join(", ")}};
        Solution solution = new Solution();
        int[] result = solution.${config.functionName}(${parameter.name});
        for (int i = 0; i < result.length; i++) {
            if (i > 0) System.out.print(" ");
            System.out.print(result[i]);
        }
    }
}`;
}
