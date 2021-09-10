import { Emoji } from "./emoji";
import { selector } from "./selector";
import { TweetAnalyser } from "./tweet_analyser";

export interface TweetElementInterface extends HTMLElement {
    content: string;
    compress: (hide_completely: boolean, reason?: string, decompress_on_hover?: boolean) => void;
    user_name: string;
    user_id: string;
    language: Promise<string>;
    hashtag: Array<string>;
    link: Array<string>;
}

export class TweetElement {
    readonly emoji_detector: Emoji;
    initialized: boolean;

    constructor() {
        this.emoji_detector = new Emoji();
        this.initialized = false;
    }

    async init(): Promise<void> {
        await this.emoji_detector.init();
        this.initialized = true;
    }

    generate(tweet: TweetElementInterface): TweetElementInterface {
        tweet.classList.add(selector.checked_tweet_class_name);

        const analyser: TweetAnalyser = new TweetAnalyser(tweet, this.emoji_detector);

        const user_id_bug_exclude_list: ReadonlyArray<string> = ["/notifications"];

        const user_id_bug_cookie = {
            content: "stc_show_user_id_error=true",
            max_age: "max-age=86400"
        } as const;
        if (
            !user_id_bug_exclude_list.includes(location.pathname) &&
            analyser.content !== null &&
            analyser.user_id === null &&
            !document.cookie.includes(user_id_bug_cookie.content)
        ) {
            alert(browser.i18n.getMessage("error_message_user_id_bug"));
            document.cookie = `${user_id_bug_cookie.content};${user_id_bug_cookie.max_age}`;
        }

        tweet.content = analyser.content || "";
        tweet.user_name = analyser.user_name;
        tweet.user_id = analyser.user_id || "";
        tweet.language = analyser.language;
        tweet.compress = (hide_completely: boolean, reason?: string, decompress_on_hover?: boolean) => {
            if (hide_completely) analyser.hide_completely();
            else analyser.compress(reason, decompress_on_hover);
        };
        tweet.hashtag = analyser.hashtag;
        tweet.link = analyser.link;

        return tweet;
    }
}
