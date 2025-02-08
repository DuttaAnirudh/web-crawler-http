const { JSDOM } = require("jsdom");

function getURLFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);

  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkEl of linkElements) {
    if (linkEl.href.slice(0, 1) === "/") {
      // relative url
      try {
        const urlObject = new URL(`${baseURL}${linkEl.href}`);
        urls.push(urlObject.href);
      } catch (err) {
        console.log("ERROR! error with relative url: ", err.message);
      }
    } else {
      // absolute url
      try {
        const urlObject = new URL(linkEl.href);
        urls.push(urlObject.href);
      } catch (err) {
        console.log("ERROR! error with absolute url: ", err.message);
      }
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const urlObject = new URL(urlString);

  const hostPath = `${urlObject.hostname}${urlObject.pathname}`;

  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

module.exports = { normalizeURL, getURLFromHTML };
