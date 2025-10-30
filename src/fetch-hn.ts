import { STORIES_TO_FETCH } from "./consts.ts";

const BASE_URL: string = "https://hacker-news.firebaseio.com";

const TOPSTORIES: string = "/v0/topstories.json";

const getHnItemUrl = (id: string) => BASE_URL + `/v0/item/${id}.json`;

type Story = {
    id: number,
    type: "job" | "story" | "comment" | "poll" | "pollopt", // but only keeping "story"
    url: string
    by?: string,
    descendants?: number,
    kids?: number[],
    score?: number,
    time?: number, // Creation date of the item, in Unix Time
    title?: string,
};

export const fetchTopStoriesIds = async (): Promise<string[]> => {
    const result = await fetch(BASE_URL + TOPSTORIES);
    const topStoriesIds = await result.json();

    if (!Array.isArray(topStoriesIds)) {
        throw new Error(
            "HackerNews fetch result is expected to be an array but is: "
            + typeof topStoriesIds
        );
    }

    return topStoriesIds.splice(0, STORIES_TO_FETCH);
}


export const fetchStory = async (id: string): Promise<Story | null> => {
    const itemId = getHnItemUrl(id);
    const result = await fetch(itemId);
    const item = await result.json();

    if (item?.type !== "story" || !item?.url) {
        return null;
    }

    return item;
}

export const fetchStoryUrlContent = async ({ url }: Story): Promise<string | null> => {
    const result = await fetch(url);
    const text = await result.text();
    return text;
}
