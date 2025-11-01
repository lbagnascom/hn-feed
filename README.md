# HackerNews RSS Feed

A Node tool that fetches [Hacker News](https://news.ycombinator.com/)' top stories, extracts their readable content, sanitizes it and generates an RSS feed.

## How it works

- Fetches top stories from [Hacker News' API](https://github.com/HackerNews/API).
- Creates each article's DOM document using [jsdom](https://github.com/jsdom/jsdom).
- Extracts the document content  with [mozilla/readability](https://github.com/mozilla/readability).
- At each step, sanitizes html using [DOMPurify](https://github.com/cure53/DOMPurify).
- Produces an RSS 2.0 feed using the [feed](https://github.com/jpmonette/feed) package.

## Disclaimer

This project automatically republishes content from third-party websites linked on [Hacker News](https://news.ycombinator.com/). 

The resulting RSS feed may contain excerpts or full text of those articles.

- All original content remains the property of its respective authors and publishers.
- This project and its author are not affiliated with or endorsed by any of those publishers.
- The feed is generated for **personal, educational, and non-commercial use only**.
- The author **does not claim ownership** of third-party content and **does not guarantee** its accuracy or completeness.

If you are a content owner and wish your material to be excluded from the feed, please open an issue or contact the repository maintainer.