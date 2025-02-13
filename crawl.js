const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return pages;
  }

  const normalisedCurrentURL = normalizeURL(currentURL);
  if (pages[normalisedCurrentURL] > 0) {
    pages[normalisedCurrentURL]++;

    return pages;
  }

  pages[normalisedCurrentURL] = 1;

  console.log(`actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status > 399) {
      console.log(
        `error in fetch with status code: ${resp.status} on page: ${currentURL}`
      );

      return pages;
    }

    const contentType = resp.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `non html response, content type: ${resp.status} on page: ${currentURL}`
      );

      return pages;
    }

    const htmlBody = await resp.text();
    const nextURLs = getURLFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (err) {
    console.log(`ERROR in fetch: ${err.message} on page ${currentURL}`);
  }
  return pages;
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
