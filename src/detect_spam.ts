import { setting_object } from "./setting";
import { normalize } from "./normalize";
import { selector } from "./selector";
import { TweetElement } from "./tweet_element";
import { is_regexp, parse_regexp } from "./parse_regexp";
import { advanced_spam_detection, query_type } from "./advanced_spam_detection";
import { browser_interface } from "./browser";


declare const browser: browser_interface;


function detect_ng_word(text: string, ng_words: Array<string>) {
    for (let x = 0; x < ng_words.length; x++) {
        const word = normalize(ng_words[x]);

        if (!word) continue;

        if (is_regexp(word) && parse_regexp(word).test(text)) return true;
        if (text.includes(word)) return true;
    }
    return false;
}

function detect_verified_badge(tweet: TweetElement) {
    return Boolean(tweet.querySelector(selector.verified_badge));
}

export function detect_spam(target: TweetElement, setting: setting_object, advanced_filter: query_type): [false] | [true, string] {
    const normal_judgement = (() => {
        const target_content = normalize(target.content);

        const has_ng_word = detect_ng_word(target_content, setting.ng_word);
        if (has_ng_word) return browser.i18n.getMessage("compress_reason_ng_word");

        const advanced_detection = advanced_spam_detection(advanced_filter, target);
        if (advanced_detection) return browser.i18n.getMessage("compress_reason_advanced_detection_default");

        return false;
    })();

    const has_verified_badge = detect_verified_badge(target);
    const verified_badge_judgement = has_verified_badge && !setting.include_verified_account;

    return normal_judgement !== false && !verified_badge_judgement ? [true, normal_judgement] : [false];
}
