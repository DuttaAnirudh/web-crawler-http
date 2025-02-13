const { sortPages } = require("./report.js");

test("sortPages", () => {
  const input = {
    "https://wagslane.dev/path": 1,
    "https://wagslane.dev": 3,
  }; // input
  const actual = sortPages(input); // output we recieve
  const expected = [
    ["https://wagslane.dev", 3],
    ["https://wagslane.dev/path", 1],
  ]; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});
