// "off" or 0 - turn the rule off
// "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
// "error" or 2 - turn the rule on as an error (exit code will be 1)

module.exports = {
  //   env: {
  //     browser: true,
  //     node: true,
  //     es2021: true
  //   },
  extends: ["plugin:vue/vue3-essential", "@vue/standard"],
  rules: {
    eqeqeq: 2,
    "class-methods-use-this": 0,
  },
  // 定义全局变量
  //   globals: {
  //     location: "readonly",
  //   },
};
