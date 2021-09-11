type setting_value_type = number | string | boolean | Array<string> | { [key: string]: { url: string } };

export interface setting_object {
    [key: string]: setting_value_type;
    advanced_filter: Array<string>;
    allow_list: Array<string>;
    background_color: string;
    decompress_on_hover: boolean;
    exclude_url: Array<string>;
    font_color: string;
    hide_completely: boolean;
    include_user_name: boolean;
    include_verified_account: boolean;
    main_color: string;
    ng_word: Array<string>;
    show_reason: boolean;
}

const default_setting: setting_object = {
    advanced_filter: [""],
    allow_list: [""],
    background_color: "rgb(0, 0, 0)",
    decompress_on_hover: false,
    exclude_url: ["https://twitter.com/home"],
    font_color: "rgb(255, 255, 255)",
    hide_completely: false,
    include_user_name: false,
    include_verified_account: false,
    main_color: "rgb(29, 161, 242)",
    ng_word: [""],
    show_reason: true
};

/**
 * Class for setting-related processing.
 */
export class Setting {
    private setting: setting_object;
    private callback: null | (() => void);

    constructor() {
        this.setting = default_setting;
        this.callback = null;
    }

    /**
     * Load current setting. To use the class, call this function first.
     *
     * This function returns setting object. If a property of the object has been changed, setting will be saved overwrite.
     * @returns setting data
     */
    async load(): Promise<setting_object> {
        const saved_setting: { setting: setting_object } = await browser.storage.local.get("setting");
        const setting = default_setting;

        if (saved_setting.setting) {
            Object.keys(saved_setting.setting)
                .filter((key) => key in default_setting)
                .forEach((key) => (setting[key] = saved_setting.setting[key]));
        }

        browser.storage.onChanged.addListener((changes) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            this.setting = changes.setting.newValue;
            if (this.callback) this.callback();
        });

        return new Proxy(setting, {
            get: (target, key: string) => this.setting[key],
            set: (target, key: string, value: setting_value_type) => {
                this.setting[key] = value;
                this.save();
                return true;
            }
        });
    }

    /**
     * Save overwrite the setting.
     */
    private save(): void {
        void browser.storage.local.set({ setting: this.setting });
    }

    /**
     * Set callback that is called when the setting has been updated.
     * @param callback callback
     */
    onChange(callback: () => void): void {
        this.callback = callback;
    }
}
