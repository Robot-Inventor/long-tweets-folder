const regexp_flag_list: ReadonlyArray<string> = ["d", "g", "i", "m", "s", "u", "y"];
const regexp_pattern = new RegExp(`^/(.*)/([${regexp_flag_list.join("")}]*)$`);

/**
 * Return if the target string is regexp pattern like following format:
 * ``/regexp pattern here/i``
 * @param pattern target string
 * @returns weather or not target string is regexp pattern.
 */
export function is_regexp(pattern: string): boolean {
    return regexp_pattern.test(pattern);
}

/**
 * Extract regexp pattern and its flag from the format like ``/regexp/i``.
 * @param pattern target pattern
 * @returns regexp pattern and its flag
 */
function parser_core(pattern: string) {
    if (!is_regexp(pattern)) return { string: pattern, flag: null };

    const core_string = pattern.replace(regexp_pattern, "$1");
    const flag_set = new Set(pattern.replace(regexp_pattern, "$2").split(""));
    const flag_list = Array.from(flag_set).filter((flag) => regexp_flag_list.includes(flag));

    return {
        string: core_string,
        flag: flag_list.length ? flag_list.join("") : null
    };
}

/**
 * Parse regexp string like ``/regexp/i`` and generate new RegExp instance.
 * @param pattern target pattern
 * @returns new RegExp instance
 */
export function parse_regexp(pattern: string): RegExp {
    const parse_result = parser_core(pattern);
    if (parse_result.flag) return new RegExp(parse_result.string, parse_result.flag);
    else return new RegExp(parse_result.string);
}
