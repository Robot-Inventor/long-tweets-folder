import { setting_object } from "./setting";
import { normalize, normalize_language_code } from "./normalize";
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

function detect_filtered_language(target_language: string, language_filter: Array<string>) {
    target_language = normalize_language_code(target_language);
    for (const filter of language_filter) {
        const normalized_filter = normalize_language_code(filter);
        if (!normalized_filter) continue;
        if (target_language === normalized_filter) return true;
    }
    return false;
}

function detect_verified_badge(tweet: TweetElement) {
    return Boolean(tweet.querySelector(selector.verified_badge));
}

export async function detect_spam(target: TweetElement, setting: setting_object, advanced_filter: query_type): Promise<[false] | [true, string]> {
    const normal_judgement = await (async () => {
        const target_content = normalize(target.content);

        const has_ng_word = detect_ng_word(target_content, setting.ng_word);
        if (has_ng_word) return browser.i18n.getMessage("compress_reason_ng_word");

        const content_language = await target.language;
        const is_filtered_language = detect_filtered_language(content_language, setting.language_filter);
        if (is_filtered_language) return browser.i18n.getMessage("compress_reason_filtered_language");

        const advanced_detection = advanced_spam_detection(advanced_filter, target);
        if (advanced_detection) return browser.i18n.getMessage("compress_reason_advanced_detection_default");

        return false;
    })();

    const has_verified_badge = detect_verified_badge(target);
    const verified_badge_judgement = has_verified_badge && !setting.include_verified_account;

    return normal_judgement !== false && !verified_badge_judgement ? [true, normal_judgement] : [false];
}
