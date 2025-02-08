const { normalizeURL, getURLFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizedURL strip protocol  ", () => {
  const input = "https://blog.boot.dev/path"; // input
  const actual = normalizeURL(input); // output we recieve
  const expected = "blog.boot.dev/path"; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// Trailing slash
test("normalizedURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/"; // input
  const actual = normalizeURL(input); // output we recieve
  const expected = "blog.boot.dev/path"; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// capitalised
test("normalizedURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/"; // input
  const actual = normalizeURL(input); // output we recieve
  const expected = "blog.boot.dev/path"; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// https --> http
test("normalizedURL strip http", () => {
  const input = "https://blog.boot.dev/path/"; // input
  const actual = normalizeURL(input); // output we recieve
  const expected = "blog.boot.dev/path"; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// absolute urls
test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://blog.boot.dev/">Boot.dev Blog</a>
    </body>
  </html>
  `; // input

  const inputBaseURL = "https://blog.boot.dev";

  const actual = getURLFromHTML(inputHTMLBody, inputBaseURL); // output we recieve
  const expected = ["https://blog.boot.dev/"]; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// relative urls
test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="/path/">Boot.dev Blog</a>
    </body>
  </html>
  `; // input

  const inputBaseURL = "https://blog.boot.dev";

  const actual = getURLFromHTML(inputHTMLBody, inputBaseURL); // output we recieve
  const expected = ["https://blog.boot.dev/path/"]; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// absolute + relative urls
test("getURLsFromHTML both", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="https://blog.boot.dev/path1/">Boot.dev Blog Path 1</a>
      <a href="/path2/">Boot.dev Blog Path 2</a>
    </body>
  </html>
  `; // input

  const inputBaseURL = "https://blog.boot.dev";

  const actual = getURLFromHTML(inputHTMLBody, inputBaseURL); // output we recieve
  const expected = [
    "https://blog.boot.dev/path1/",
    "https://blog.boot.dev/path2/",
  ]; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});

// invalid/broken urls
test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <a href="invalid">Boot.dev Blog</a>
    </body>
  </html>
  `; // input

  const inputBaseURL = "https://blog.boot.dev";

  const actual = getURLFromHTML(inputHTMLBody, inputBaseURL); // output we recieve
  const expected = []; // output we 'expect' to recieve

  expect(actual).toEqual(expected); // comparing actual output to expected output
});
