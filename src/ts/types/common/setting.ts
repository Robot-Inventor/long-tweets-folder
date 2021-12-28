import { is_object, is_string_array } from "./type_predicate_utility";
import { ValidateFunction } from "ajv/dist/types/index";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore There is no type declaration because ./setting.validate is an automatically generated script.
import validate20 from "./setting.validate";

interface ColorSetting {
    main: string;
    main_light: string;
    background: string;
    high_emphasize_text: string;
    medium_emphasize_text: string;
    top_app_bar: string;
    drawer: string;
    card: string;
    card_hover: string;
}

// When edit this interface, please run ``npm run update-validator`` to update the JSON validator for settings.
interface setting_object {
    advanced_filter: Array<string>;
    allow_list: Array<string>;
    color: ColorSetting;
    decompress_on_hover: boolean;
    exclude_url: Array<string>;
    hide_completely: boolean;
    include_user_name: boolean;
    include_verified_account: boolean;
    ng_word: Array<string>;
    show_reason: boolean;
}

const is_color_setting = (input: unknown): input is ColorSetting => {
    if (!is_object(input)) return false;

    const all_properties = [
        "main",
        "main_light",
        "background",
        "high_emphasize_text",
        "medium_emphasize_text",
        "top_app_bar",
        "drawer",
        "card",
        "card_hover"
    ];
    const has_all_properties = all_properties.every(
        (property) => property in input && typeof input[property] === "string"
    );
    return has_all_properties;
};

const is_setting_object = (input: unknown): input is setting_object => {
    if (!is_object(input)) return false;

    const all_properties = [
        "advanced_filter",
        "allow_list",
        "color",
        "decompress_on_hover",
        "exclude_url",
        "hide_completely",
        "include_user_name",
        "include_verified_account",
        "ng_word",
        "show_reason"
    ];
    const has_all_properties = all_properties.every((property) => property in input);
    if (!has_all_properties) return false;

    if (!is_string_array(input.advanced_filter)) return false;
    if (!is_string_array(input.allow_list)) return false;
    if (!is_color_setting(input.color)) return false;
    if (typeof input.decompress_on_hover !== "boolean") return false;
    if (!is_string_array(input.exclude_url)) return false;
    if (typeof input.hide_completely !== "boolean") return false;
    if (typeof input.include_user_name !== "boolean") return false;
    if (typeof input.include_verified_account !== "boolean") return false;
    if (!is_string_array(input.ng_word)) return false;
    if (typeof input.show_reason !== "boolean") return false;

    return true;
};

const get_setting_validator = () => {
    const validate = validate20 as ValidateFunction<setting_object>;
    return validate;
};

export { ColorSetting, setting_object };
export { is_setting_object, get_setting_validator };
