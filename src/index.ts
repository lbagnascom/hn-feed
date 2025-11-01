import { Feed } from "feed";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fetchStory, fetchStoryUrlContent, fetchTopStoriesIds } from "./fetch-hn.ts";
import sanitize from "./sanitize.ts";
import extractArticle from "./extract-article.ts";

const storyIds = await fetchTopStoriesIds();

const feed = new Feed({
    id: "SomeRandomId",
    title: "Hacker News RSS Feed",
    copyright: "Some copyright",
    language: "en",
    description: "Hacker news front page improved",
    link: "https://lbagnascom.github.io/hn-feed/feed.xml"
});

await Promise.all(
    storyIds.map(async (id: string): Promise<void> => {
        const story = await fetchStory(id);
        if (!story) {
            return;
        }
        const pageText = await fetchStoryUrlContent(story);
        if (!pageText) {
            return;
        }
        const cleanPageText = sanitize(pageText);
        const article = extractArticle(cleanPageText, story.url);
        if (!article) {
            return;
        }
        const authorName = story.by ?? article.byline;
        const cleanContent = sanitize(article.content);
        console.log(`Success creating article with id ${id} and url ${story.url}`);

        feed.addItem({
            id: story.id.toString(),
            date: new Date(story.time ? story.time * 1000 : Date.now()),
            link: story.url,
            title: story.title ?? article.title ?? "Unkown title",
            content: cleanContent,
            description: article.excerpt ?? undefined,
            author: authorName ? [{ name: authorName }] : undefined,
        });
    })
);


const distDir = "dist";
const feedPath = distDir + "/feed.xml";

try {
    if (!existsSync(distDir)) {
        mkdirSync(distDir);
    }
    writeFileSync(feedPath, feed.rss2());
    console.log(`File '${feedPath}' created successfully`);
} catch (err) {
    console.log(`Error creating '${feedPath}' : ${err}`);
}