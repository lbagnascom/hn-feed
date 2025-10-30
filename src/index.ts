import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import { Feed, type Author, type Item } from "feed";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fetchStory, fetchStoryUrlContent, fetchTopStoriesIds } from "./fetch-hn.ts";
import DOMPurify from "dompurify";

const storyIds = await fetchTopStoriesIds();

const stories = await Promise.all(storyIds.map(async (id) => {
    const story = await fetchStory(id);
    if (!story) {
        return null;
    }

    const pageText = await fetchStoryUrlContent(story);
    if (!pageText) {
        return null;
    }

    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const cleanPageText = purify.sanitize(pageText);

    const jsdomPage = new JSDOM(cleanPageText, { url: story.url });
    const reader = new Readability(jsdomPage.window.document);
    const article = reader.parse();

    if (!article || !article.content) {
        return null;
    }

    const author: Author = {
        name: article.byline ?? "Uknown author",
    }

    const item: Item = {
        date: new Date(story.time ? story.time * 1000 : ""),
        link: story.url,
        title: story.title ?? article.title ?? "",
        content: article.content,
        description: article.excerpt ?? "",
        author: [author],
    };

    return item;
}));

const feed = new Feed({
    id: "SomeRandomId",
    title: "Hacker News: Front Page",
    copyright: "Some copyright",
    language: "en",
    description: "Hacker news front page improved",
    link: "https://lbagnascom.github.io/hn-feed/feed.xml"
});

stories
    .filter((value) => value !== null)
    .forEach((article) => { feed.addItem(article) });


try {
    const distDir = "dist";
    if (!existsSync(distDir)) {
        mkdirSync(distDir);
    }
    writeFileSync(distDir + "/feed.xml", feed.rss2());
    console.log("File 'dist/feed.xml' created successfully");
} catch (err) {
    console.log("Error creating 'dist/feed.xml' : " + err);
}