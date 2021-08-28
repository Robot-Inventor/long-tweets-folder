import { selector } from "./selector";
import { TweetElement } from "./tweet_element";
import { hash_symbol, normalize_hashtag, normalize_link, normalize_user_id } from "./normalize";
import { Emoji } from "./emoji";

export class TweetAnalyser {
    private readonly tweet: TweetElement;
    private readonly content_element: HTMLElement | null;
    private readonly emoji_detector: Emoji;

    constructor(tweet: TweetElement, emoji_detector: Emoji) {
        this.tweet = tweet;
        this.content_element = tweet.querySelector(selector.tweet_content);
        this.emoji_detector = emoji_detector;
    }

    private get_text_content(element: HTMLElement) {
        const clone = element.cloneNode(true);
        const temp = document.createElement("div");
        temp.appendChild(clone);
        temp.querySelectorAll("img").forEach((element) => {
            const emoji = this.emoji_detector.get_from_url(element.src);
            if (emoji) element.insertAdjacentText("afterend", emoji);
            element.remove();
        });
        return temp.textContent;
    }

    get content(): string | null {
        if (!this.content_element) return null;

        return this.get_text_content(this.content_element) || "";
    }

    get user_name(): string {
        const user_name_element: HTMLElement | null = this.tweet.querySelector(selector.user_name);
        if (user_name_element) return this.get_text_content(user_name_element) || "";
        else return "";
    }

    get user_id(): string | null {
        const user_id_element = this.tweet.querySelector(selector.user_id);
        if (user_id_element) return normalize_user_id(user_id_element.textContent || "");
        else return null;
    }

    get language(): Promise<string> {
        return this.get_language();
    }

    private async get_language(): Promise<string> {
        const target_node = this.content_element;
        let target_text = this.content || "";
        if (target_node) {
            const clone = target_node.cloneNode(true);
            const temporary_element = document.createElement("div");
            temporary_element.appendChild(clone);
            temporary_element.querySelectorAll(selector.hashtag_link_mention).forEach((element) => element.remove());
            target_text = temporary_element.textContent || "";
        }
        const detect = await browser.i18n.detectLanguage(target_text);
        if (detect.isReliable) return detect.languages[0].language.replace(/-.*$/, "");
        else if (this.content_element && this.content_element.lang) return this.content_element.lang;
        else return "";
    }

    compress(reason?: string, decompress_on_hover?: boolean): void {
        const decompress_button = document.createElement("button");
        decompress_button.setAttribute("class", this.tweet.getAttribute("class") || "");
        decompress_button.classList.add(selector.show_tweet_button.replace(/^\./, ""));

        const user_name = this.tweet.user_name;
        const user_id = this.tweet.user_id;
        if (reason) {
            const button_text: string = browser.i18n.getMessage("decompress_button_strict_with_reason", [
                user_name,
                `@${user_id}`,
                reason
            ]);
            decompress_button.textContent = button_text;
        } else {
            const button_text: string = browser.i18n.getMessage("decompress_button_strict_without_reason", [
                user_name,
                `@${user_id}`
            ]);
            decompress_button.textContent = button_text;
        }
        decompress_button.addEventListener("click", () => {
            this.tweet.style.display = "block";
            decompress_button.remove();
        });

        if (decompress_on_hover) {
            decompress_button.addEventListener("mouseover", () => {
                this.tweet.style.display = "block";
                decompress_button.remove();
            });
        }

        this.tweet.style.display = "none";
        this.tweet.insertAdjacentElement("afterend", decompress_button);
    }

    hide_completely(): void {
        this.tweet.style.display = "none";
    }

    get hashtag(): Array<string> {
        const is_hashtag = (element: Element) => {
            return element.textContent && hash_symbol.includes(element.textContent[0]);
        };
        const normalize = (element: Element) => {
            return normalize_hashtag(element.textContent || "");
        };
        return [...this.tweet.querySelectorAll(selector.hashtag_link_mention)].filter(is_hashtag).map(normalize);
    }

    get link(): Array<string> {
        function is_link(element: Element) {
            return Boolean(element.querySelector(selector.link_scheme_outer));
        }
        function normalize(element: Element) {
            return normalize_link((element.textContent || "").replace(/…$/, ""));
        }
        return [...this.tweet.querySelectorAll(selector.hashtag_link_mention)].filter(is_link).map(normalize);
    }
}
