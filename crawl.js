const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log(`actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status} on page: ${currentURL}`
      );

      return;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type: ${resp.status} on page: ${currentURL}`
      );

      return;
    }

    console.log(await resp.text());
  } catch (err) {
    console.log(`ERROR in fetch: ${err.message} on page ${currentURL}`);
  }
}

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

module.exports = { normalizeURL, getURLFromHTML, crawlPage };
