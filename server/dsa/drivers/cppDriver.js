export default function cppDriver(code, config, test) {
  return `
#include<bits/stdc++.h>
using namespace std;

${code}

int main(){

    Solution obj;

    vector<int> nums={${test.input.nums.join(",")}};

    vector<int> ans=obj.${config.functionName}(nums);

    for(int x:ans)
        cout<<x<<" ";

    return 0;
}
`;
}
