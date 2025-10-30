import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

const window = new JSDOM('').window;

// @ts-expect-error
const purify = DOMPurify(window);

const sanitize = (html: string): string =>
    purify.sanitize(html);

export default sanitize;