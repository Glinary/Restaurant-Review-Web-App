module.exports = {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["dist/**/*.css"],
  rules: {
    "selector-type-no-unknown": [true, { ignoreTypes: ["page"] }],
  },
};
