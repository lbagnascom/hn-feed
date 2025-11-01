import { isProbablyReaderable, Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";

type Nullable<T> = T | null | undefined

type VeryPartial<T> = Nullable<
    { [P in keyof T]?: Nullable<T[P]>; }
>

type Article = {
    content: string;
    byline: Nullable<string>;
    title: Nullable<string>;
    textContent: Nullable<string>;
    length: Nullable<number>;
    excerpt: Nullable<string>;
    dir: Nullable<string>;
    siteName: Nullable<string>;
    lang: Nullable<string>;
    publishedTime: Nullable<string>;
};

const parseArticle = (article: VeryPartial<Article>, url: string): Article | null => {
    if (!article || !article.content) {
        console.log(`Failed parsing article with url ${url}`);
        return null;
    }
    return article as Article;
}

const extractArticle = (html: string, url: string): Article | null => {
    const { document } = new JSDOM(html, { url }).window;
    if (!isProbablyReaderable(document)) {
        console.log(`Skipped parsing article with url ${url} for not being probablyReaderdable`);
        return null;
    }
    const reader = new Readability(document);
    const article = reader.parse();
    return parseArticle(article, url);
}

export default extractArticle;