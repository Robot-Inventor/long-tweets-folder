import { TweetElement } from "./tweet_element";
import { normalize_hashtag, normalize_link, normalize_user_id } from "./normalize";
import { is_regexp, parse_regexp } from "./parse_regexp";

interface query_element {
    mode: "include" | "exclude";
    type: "text" | "hashtag" | "name" | "id" | "link";
    string: string;
}

export type query_type = ["and" | "or", Array<query_element | query_type>];

export interface query_object {
    rule: query_type;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const query_example: query_object = {
    rule: [
        "and",
        [
            {
                mode: "include",
                type: "text",
                string: "spam spam"
            },
            {
                mode: "exclude",
                type: "name",
                string: "i am spam"
            },
            {
                mode: "include",
                type: "id",
                string: "/spam.*+/i"
            },
            {
                mode: "exclude",
                type: "hashtag",
                string: "spam"
            },
            [
                "or",
                [
                    {
                        mode: "exclude",
                        type: "link",
                        string: "twitter.com/home"
                    },
                    {
                        mode: "include",
                        type: "text",
                        string: "i'm spam"
                    }
                ]
            ]
        ]
    ]
};

/**
 * Return if the type of target variable is query_element.
 * @param argument target variable
 * @returns weather or not the target variable is query_element
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function is_query_element(argument: any): argument is query_element {
    return (
        argument !== null &&
        typeof argument === "object" &&
        "mode" in argument &&
        "type" in argument &&
        "string" in argument &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof argument.mode === "string" &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof argument.type === "string" &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        typeof argument.string === "string"
    );
}

function judge(target: string | Array<string>, pattern: string) {
    const is_regex = is_regexp(pattern);

    if (typeof target === "string") {
        if (is_regex) return parse_regexp(pattern).test(target);
        else return target.includes(pattern);
    } else {
        let result = false;
        target.forEach((t) => {
            if ((is_regex && parse_regexp(pattern).test(t)) || t === pattern) result = true;
        });
        return result;
    }
}

/**
 * Detect spam with advanced filter.
 * @param query advanced filter
 * @param tweet target tweet
 * @returns weather or not the target tweet is spam
 */
export function advanced_spam_detection(query: query_type, tweet: TweetElement): boolean {
    let result = query[0] === "and";

    query[1].forEach((query_object) => {
        let judgement = false;

        if (is_query_element(query_object)) {
            let includes_text = false;

            switch (query_object.type) {
                case "text":
                    includes_text = judge(tweet.content, query_object.string);
                    break;

                case "hashtag":
                    includes_text = judge(tweet.hashtag, normalize_hashtag(query_object.string));
                    break;

                case "id":
                    includes_text = judge(tweet.user_id, normalize_user_id(query_object.string));
                    break;

                case "name":
                    includes_text = judge(tweet.user_name, query_object.string);
                    break;

                case "link":
                    includes_text = judge(
                        tweet.link,
                        is_regexp(query_object.string) ? query_object.string : normalize_link(query_object.string)
                    );
                    break;
            }

            judgement = query_object.mode === "include" ? includes_text : !includes_text;
        } else {
            judgement = advanced_spam_detection(query_object, tweet);
        }

        if (query[0] === "and" && !judgement) result = false;
        else if (query[0] === "or" && judgement) result = true;
    });

    return result;
}
