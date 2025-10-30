# HackerNews RSS Feed

A Node tool that fetches Hacker News' front page stories, extracts their content and generates an RSS feed.

The feed is available at [lbagnascom.github.io/hn-feed/feed.xml](https://lbagnascom.github.io/hn-feed/feed.xml) and automatically generated every day using the GitHub workflow in this repo.

## How it works

- Fetches front page stories from [Hacker News' API](https://github.com/HackerNews/API).
- Extracts the content using 
    - [jsdom](https://github.com/jsdom/jsdom) to get each article's DOM document
    - [@mozilla/readability](https://github.com/mozilla/readability) to extract the document content.
- Sanitizes each fetched article and readability output using [DOMPurify](https://github.com/cure53/DOMPurify)
- Produces an RSS 2.0 feed using the [feed](https://github.com/jpmonette/feed) package.
