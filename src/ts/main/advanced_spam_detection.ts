import { is_regexp, parse_regexp } from "./parse_regexp";
import { normalize_hashtag, normalize_link, normalize_user_id } from "./normalize";
import { TweetElement } from "./tweet_element";
import { is_object } from "../common/type_predicate_utility";

interface query_element {
    mode: "include" | "exclude";
    type: "text" | "hashtag" | "name" | "id" | "link";
    string: string;
}

export type query_type = ["and" | "or", Array<query_element | query_type>];

/**
 * To see example, please refer to docs/<lang>/advanced_spam_detection.md
 */
export interface query_object {
    rule: query_type;
}

/**
 * Return if the type of target variable is query_element.
 * @param argument target variable
 * @returns weather or not the target variable is query_element
 */
const is_query_element = (argument: unknown): argument is query_element => {
    // Check if argument is an object.
    if (!is_object(argument)) return false;

    // Check if argument has all necessary properties.
    const all_properties = ["mode", "type", "string"];
    const has_all_properties = all_properties.every((property) => property in argument && typeof property === "string");
    return has_all_properties;
};

const is_query_type = (input: unknown): input is query_type => {
    if (!Array.isArray(input)) return false;

    if (input.length !== 2) return false;

    if (!["and", "or"].includes(input[0])) return false;

    if (!Array.isArray(input[1])) return false;

    return input[1].every((element) => is_query_element(element) || is_query_type(element));
};

const is_query_object = (input: unknown): input is query_object => {
    if (!is_object(input)) return false;
    if (!("rule" in input)) return false;
    return is_query_type(input.rule);
};

const judge = (target: string | Array<string>, pattern: string) => {
    const is_regex = is_regexp(pattern);

    if (typeof target === "string") {
        if (is_regex) return parse_regexp(pattern).test(target);
        else return target.includes(pattern);
    } else {
        let result = false;
        target.forEach((str) => {
            if ((is_regex && parse_regexp(pattern).test(str)) || str === pattern) result = true;
        });
        return result;
    }
};

/**
 * Detect spam with advanced filter.
 * @param query advanced filter
 * @param tweet target tweet
 * @returns weather or not the target tweet is spam
 */
const advanced_spam_detection = (query: query_type, tweet: TweetElement): boolean => {
    let result = query[0] === "and";

    query[1].forEach((query_obj) => {
        let judgement = false;

        if (is_query_element(query_obj)) {
            let includes_text = false;

            switch (query_obj.type) {
                case "text":
                    includes_text = judge(tweet.content, query_obj.string);
                    break;

                case "hashtag":
                    includes_text = judge(tweet.hashtag, normalize_hashtag(query_obj.string));
                    break;

                case "id":
                    includes_text = judge(tweet.user_id, normalize_user_id(query_obj.string));
                    break;

                case "name":
                    includes_text = judge(tweet.user_name, query_obj.string);
                    break;

                case "link":
                    includes_text = judge(
                        tweet.link,
                        is_regexp(query_obj.string) ? query_obj.string : normalize_link(query_obj.string)
                    );
                    break;

                default:
                    includes_text = false;
            }

            judgement = query_obj.mode === "include" ? includes_text : !includes_text;
        } else {
            judgement = advanced_spam_detection(query_obj, tweet);
        }

        if (query[0] === "and" && !judgement) result = false;
        else if (query[0] === "or" && judgement) result = true;
    });

    return result;
};

export { advanced_spam_detection, is_query_object };
