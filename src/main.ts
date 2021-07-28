import { query_object, query_type } from "./advanced_spam_detection";
import { detect_spam } from "./detect_spam";
import { load_setting, setting_object } from "./load_setting";
import { selector } from "./selector";
import { TweetAnalyser } from "./tweet_analyser";
import { TweetElement } from "./tweet_element";
import { browser_interface } from "./browser";
import { advanced_filter_type } from "./advanced_filter_type";


declare const browser: browser_interface;


function get_unchecked_tweets() {
    const tweets: NodeListOf<TweetElement> = document.querySelectorAll(`${selector.tweet_outer}:not(.${selector.checked_tweet_class_name})`);
    const result: Array<TweetElement> = [];

    function get_ready(tweet: TweetElement) {
        tweet.classList.add(selector.checked_tweet_class_name);

        const analyser: TweetAnalyser = new TweetAnalyser(tweet);

        tweet.content = analyser.get_content();
        tweet.user_name = analyser.get_user_name();
        tweet.user_id = analyser.get_user_id();
        tweet.language = analyser.get_language();
        tweet.compress = (compressor_mode: "normal" | "strict", hide_media: boolean, trim_leading_whitespace: boolean) => {
            analyser.compress(compressor_mode, hide_media, trim_leading_whitespace);
        };
        tweet.hashtag = analyser.get_hashtag();
        tweet.link = analyser.get_link();

        result.push(tweet);
    }

    tweets.forEach(get_ready);
    return result;
}

async function run_check(setting: setting_object, advanced_filter: query_type) {
    const exclude_url = setting.exclude_url;

    if (exclude_url.includes(location.href)) return;

    const check_target = get_unchecked_tweets();

    const compressor_mode = setting.strict_mode ? "strict" : "normal";
    const hide_media = setting.hide_media;
    const trim_leading_whitespace = setting.trim_leading_whitespace;

    for (let i = 0; i < check_target.length; i++) {
        const target = check_target[i];
        const is_spam = await detect_spam(target, setting, advanced_filter);
        if (is_spam) target.compress(compressor_mode, hide_media, trim_leading_whitespace);
    }
}

async function get_json(url: string) {
    // deepcode ignore Ssrf: <This is because the function is to read only the trusted files listed in dist/advanced_filter.json.>
    const response = await fetch(url);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const json = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return json;
}

void (async () => {
    const setting = await load_setting();

    const filter_list: Array<query_type> = [];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const filter_url_data: advanced_filter_type = await get_json(browser.runtime.getURL("dist/advanced_filter.json"));
    for (let i = 0; i < setting.advanced_filter.length; i++) {
        const key = setting.advanced_filter[i];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const json_data: query_object = await get_json(filter_url_data[key].url);
        filter_list.push(json_data.rule);
    }
    const joined_advanced_filter: query_type = ["or", [...filter_list]];

    const body_observer_target = document.body;
    const body_observer = new MutationObserver(() => {
        const timeline = document.querySelector(selector.timeline);

        if (timeline) {
            body_observer.disconnect();

            const main_observer_target = timeline;
            const main_observer = new MutationObserver(() => {
                void run_check(setting, joined_advanced_filter);
            });
            main_observer.observe(main_observer_target, {
                childList: true,
                subtree: true
            });
        }
    });
    body_observer.observe(body_observer_target, {
        childList: true,
        subtree: true
    });
})();
