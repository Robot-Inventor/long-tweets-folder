/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/browser_action_view.ts":
/*!************************************!*\
  !*** ./src/browser_action_view.ts ***!
  \************************************/
/***/ (() => {


const selected_item_selector = ".tab_switcher_item[data-selected]";
function show_item(selector) {
    if (!selector)
        return;
    const item_group = document.querySelectorAll(".setting_item_group");
    item_group.forEach((element) => {
        element.style.display = "none";
    });
    const target = document.querySelector(selector);
    if (target)
        target.style.display = "block";
}
const default_selected_item = document.querySelector(selected_item_selector);
if (default_selected_item)
    show_item(default_selected_item.dataset.target);
const tab_switcher_item = document.querySelectorAll(".tab_switcher_item");
tab_switcher_item.forEach((item) => {
    item.addEventListener("click", () => {
        const selected_item = document.querySelector(selected_item_selector);
        if (selected_item)
            delete selected_item.dataset.selected;
        item.dataset.selected = "";
        show_item(item.dataset.target);
    });
});


/***/ }),

/***/ "./src/color.ts":
/*!**********************!*\
  !*** ./src/color.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "update_color_setting": () => (/* binding */ update_color_setting),
/* harmony export */   "load_color_setting": () => (/* binding */ load_color_setting)
/* harmony export */ });
/* harmony import */ var _load_setting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./load_setting */ "./src/load_setting.ts");
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selector */ "./src/selector.ts");


async function update_color_setting() {
    const setting = await (0,_load_setting__WEBPACK_IMPORTED_MODULE_0__.load_setting)();
    const tweet_button_inner = document.querySelector(_selector__WEBPACK_IMPORTED_MODULE_1__.selector.tweet_button_inner);
    if (tweet_button_inner && tweet_button_inner.parentElement) {
        const main_color = getComputedStyle(tweet_button_inner.parentElement).backgroundColor;
        if (main_color)
            setting.main_color = main_color;
    }
    const background_color = getComputedStyle(document.body).backgroundColor;
    if (background_color)
        setting.background_color = background_color;
    const account_name = document.querySelector(_selector__WEBPACK_IMPORTED_MODULE_1__.selector.account_name);
    if (account_name)
        setting.font_color = getComputedStyle(account_name).color;
    void browser.storage.local.set({ "setting": setting });
}
function change_opacity(rgb, opacity) {
    return rgb.replace(/^rgb\(/, "rgba(").replace(/\)$/, `, ${opacity})`);
}
async function load_color_setting() {
    const setting = await (0,_load_setting__WEBPACK_IMPORTED_MODULE_0__.load_setting)();
    const style_element = document.createElement("style");
    style_element.textContent = `
:root {
    --main_color: ${setting.main_color};
    --background_color: ${setting.background_color};
    --high_emphasize_text_color: ${change_opacity(setting.font_color, 0.87)};
    --medium_emphasize_text_color: ${change_opacity(setting.font_color, 0.60)};
}
    `;
    document.body.appendChild(style_element);
}


/***/ }),

/***/ "./src/load_setting.ts":
/*!*****************************!*\
  !*** ./src/load_setting.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "load_setting": () => (/* binding */ load_setting)
/* harmony export */ });
const default_setting = {
    break_threshold: 15,
    hide_media: false,
    include_verified_account: false,
    strict_mode: true,
    show_reason: true,
    character_repetition_threshold: 10,
    ng_word: [""],
    allow_list: [""],
    exclude_url: ["https://twitter.com/home"],
    language_filter: [""],
    advanced_filter: [""],
    main_color: "rgb(29, 161, 242)",
    background_color: "rgb(0, 0, 0)",
    font_color: "rgb(255, 255, 255)"
};
async function load_setting() {
    const saved_setting = await browser.storage.local.get("setting");
    const setting = default_setting;
    if (saved_setting.setting) {
        Object.keys(default_setting).forEach((key) => {
            setting[key] = saved_setting.setting[key] !== undefined ? saved_setting.setting[key] : default_setting[key];
        });
    }
    return setting;
}


/***/ }),

/***/ "./src/selector.ts":
/*!*************************!*\
  !*** ./src/selector.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "selector": () => (/* binding */ selector)
/* harmony export */ });
function generate_media_selector() {
    const media_selector = {
        image: ".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1s2bzr4.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg",
        video: ".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1s2bzr4.r-1ny4l3l.r-1udh08x",
        summary_card: ".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-18u37iz.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg",
        summary_with_large_image: ".css-1dbjc4n.r-1867qdf.r-1phboty.r-rs99b7.r-1ny4l3l.r-1udh08x.r-o7ynqc.r-6416eg"
    };
    let merged = "";
    Object.keys(media_selector).forEach((key) => {
        merged += "," + media_selector[key];
    });
    merged = merged.replace(/^,/, "");
    return merged;
}
const selector = {
    tweet_outer: "div.css-1dbjc4n.r-1adg3ll.r-1ny4l3l",
    tweet_content: ".css-901oao.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0",
    user_name: ".css-901oao.css-bfa6kz.r-1awozwy.r-6koalj.r-1tl8opc.r-a023e6.r-b88u0q.r-rjixqe.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0",
    user_id: ".css-901oao.css-bfa6kz.r-18u37iz.r-1qd0xha.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0",
    timeline: "main",
    checked_tweet_class_name: "spam-tweets-compressor-checked",
    media: generate_media_selector(),
    verified_badge: "svg.r-jwli3a.r-4qtqp9.r-yyyyoo.r-1xvli5t.r-9cviqr.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr",
    hashtag_link_mention: ".css-4rbku5.css-18t94o4.css-901oao.css-16my406.r-1loqt21.r-poiln3.r-bcqeeo.r-qvutc0",
    link_scheme_outer: ".css-901oao.css-16my406.r-1tl8opc.r-hiw28u.r-qvk6io.r-bcqeeo.r-qvutc0",
    tweet_button_inner: ".css-901oao.r-1awozwy.r-jwli3a.r-6koalj.r-18u37iz.r-16y2uox.r-1tl8opc.r-a023e6.r-b88u0q.r-1777fci.r-rjixqe.r-bcqeeo.r-q4m81j.r-qvutc0",
    account_name: ".css-901oao.css-bfa6kz.r-1awozwy.r-6koalj.r-1tl8opc.r-b88u0q.r-bcqeeo.r-1udh08x.r-3s2u2q.r-qvutc0"
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./src/browser_action.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _load_setting__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./load_setting */ "./src/load_setting.ts");
/* harmony import */ var _browser_action_view__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./browser_action_view */ "./src/browser_action_view.ts");
/* harmony import */ var _browser_action_view__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_browser_action_view__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _color__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./color */ "./src/color.ts");



class ValidationMessage {
    constructor(element, message) {
        const message_element = document.createElement("span");
        message_element.textContent = message;
        message_element.style.display = "none";
        message_element.className = "validation_message";
        element.insertAdjacentElement("afterend", message_element);
        this.message_element = message_element;
    }
    show() {
        this.message_element.style.display = "inline-block";
    }
    hide() {
        this.message_element.style.display = "none";
    }
}
function get_setting_name(element) {
    const setting_name = element.dataset.settingName;
    if (setting_name)
        return setting_name;
    else
        throw "設定の名称が指定されていないinput要素が見つかりました";
}
(0,_load_setting__WEBPACK_IMPORTED_MODULE_0__.load_setting)().then((setting) => {
    void (0,_color__WEBPACK_IMPORTED_MODULE_2__.load_color_setting)();
    const number_input_element_list = document.querySelectorAll("input[type='number']");
    number_input_element_list.forEach((input_element) => {
        const setting_name = get_setting_name(input_element);
        input_element.value = String(setting[setting_name]);
        const validation_message = new ValidationMessage(input_element, input_element.dataset.validationMessage || "不正な値です");
        input_element.addEventListener("input", () => {
            let new_value_string = input_element.value;
            new_value_string = new_value_string.normalize("NFKC");
            const is_only_number = !/\D/.test(new_value_string);
            if (!is_only_number) {
                validation_message.show();
                return;
            }
            const new_value = parseInt(new_value_string);
            const is_valid_range = (() => {
                const min_number = input_element.min ? parseInt(input_element.min) : null;
                const max_number = input_element.max ? parseInt(input_element.max) : null;
                if (min_number !== null && max_number !== null)
                    return new_value >= min_number && new_value <= max_number;
                else if (min_number === null && max_number !== null)
                    return new_value <= max_number;
                else if (min_number !== null && max_number === null)
                    return new_value >= min_number;
                else
                    return true;
            })();
            if (!is_valid_range) {
                validation_message.show();
                return;
            }
            validation_message.hide();
            setting[setting_name] = new_value;
            void browser.storage.local.set({ "setting": setting });
        });
    });
    const checkbox_input_element = document.querySelectorAll("input[type='checkbox']");
    checkbox_input_element.forEach((input_element) => {
        const setting_name = get_setting_name(input_element);
        const saved_value = setting[setting_name];
        input_element.checked = typeof saved_value === "boolean" ? saved_value : false;
        input_element.addEventListener("change", () => {
            setting[setting_name] = input_element.checked;
            void browser.storage.local.set({ "setting": setting });
        });
    });
}).catch(() => {
    console.error("設定を読み込めませんでした");
});

})();

/******/ })()
;