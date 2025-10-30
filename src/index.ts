import { Feed, type Item } from "feed";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fetchStory, fetchStoryUrlContent, fetchTopStoriesIds } from "./fetch-hn.ts";
import sanitize from "./sanitize.ts";
import extractArticle from "./extract-article.ts";

const storyIds = await fetchTopStoriesIds();

const stories = await Promise.all(storyIds.map(async (id: string): Promise<Item | null> => {
    const story = await fetchStory(id);
    if (!story) {
        return null;
    }

    const pageText = await fetchStoryUrlContent(story);
    if (!pageText) {
        return null;
    }

    const cleanPageText = sanitize(pageText);
    const article = extractArticle(cleanPageText, story.url);
    if (!article) {
        return null;
    }

    const cleanContent = sanitize(article.content);

    return {
        date: new Date(story.time ? story.time * 1000 : Date.now()),
        link: story.url,
        title: story.title ?? article.title ?? "Unkown title",
        content: cleanContent,
        description: article.excerpt ?? undefined,
        author: article.byline ? [{ name: article.byline }] : undefined,
    };
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