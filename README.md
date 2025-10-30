# HackerNews RSS Feed

A Node tool that fetches Hacker News' front page stories, extracts each article's content and generates an RSS feed.

The feed is available in https://lbagnascom.github.io/hn-feed/feed.xml and automatically generated every day using the github workflow in this repo.

## How it works

- Fetches front page stories from [Hacker News' API](https://github.com/HackerNews/API).
- Extracts article content using 
    - [jsdom](https://github.com/jsdom/jsdom) to get the article's DOM document
    - [@mozilla/readability](https://github.com/mozilla/readability) to extract the document content.
- Produces an RSS 2.0 feed using the [feed](https://github.com/jpmonette/feed) package.
