/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/detect_spam.ts":
/*!****************************!*\
  !*** ./src/detect_spam.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "detect_spam": () => (/* binding */ detect_spam)
/* harmony export */ });
/* harmony import */ var _normalize__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./normalize */ "./src/normalize.ts");
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./selector */ "./src/selector.ts");


function detect_ng_word(text, ng_words) {
    for (let x = 0; x < ng_words.length; x++) {
        const word = (0,_normalize__WEBPACK_IMPORTED_MODULE_0__.normalize)(ng_words[x]);
        if (!word)
            continue;
        const is_regex = /^\/(.*)\/\D*$/.test(word);
        const regex_core_string = word.replace(/^\//, "").replace(/\/(\D*)$/, "");
        const regex_flag = word.replace(/^\/.*?\/(\D*)$/, "$1");
        const regex = new RegExp(regex_core_string, regex_flag);
        if (is_regex && regex.test(text))
            return true;
        if (text.includes(word))
            return true;
    }
    return false;
}
function detect_filtered_language(target_language, language_filter) {
    for (let i = 0; i < language_filter.length; i++) {
        const filter = language_filter[i];
        if (target_language === filter)
            return true;
    }
    return false;
}
function detect_verified_badge(tweet) {
    return Boolean(tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_1__.selector.verified_badge));
}
async function detect_spam(target, setting) {
    const target_content = (0,_normalize__WEBPACK_IMPORTED_MODULE_0__.normalize)(target.content);
    const breaks = target_content.match(/\n/g);
    const break_length = breaks ? breaks.length : 0;
    const has_too_many_breaks = break_length >= setting.break_threshold;
    const repeated_character = new RegExp(`(.)\\1{${setting.character_repetition_threshold},}`).test(target_content);
    const has_ng_word = detect_ng_word(target_content, setting.ng_word);
    const content_language = await target.language;
    const is_filtered_language = detect_filtered_language(content_language || "", setting.language_filter);
    const has_verified_badge = detect_verified_badge(target);
    const verified_badge_judgement = has_verified_badge && !setting.include_verified_account;
    const normal_judgement = has_too_many_breaks || repeated_character || has_ng_word || is_filtered_language;
    return normal_judgement && !verified_badge_judgement;
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
    break_threshold: 5,
    hide_media: true,
    trim_leading_whitespace: true,
    include_verified_account: false,
    strict_mode: false,
    character_repetition_threshold: 5,
    ng_word: [""],
    exclude_url: ["https://twitter.com/home", "https://twitter.com/notifications"],
    language_filter: [""]
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

/***/ "./src/normalize.ts":
/*!**************************!*\
  !*** ./src/normalize.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "normalize": () => (/* binding */ normalize)
/* harmony export */ });
function normalize(text) {
    text = text.normalize("NFKC").toLowerCase().replace(/[ぁ-ん]/g, (s) => {
        return String.fromCharCode(s.charCodeAt(0) + 0x60);
    });
    return text;
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
    tweet_outer: ".css-1dbjc4n.r-qklmqi.r-1adg3ll.r-1ny4l3l",
    tweet_content: ".css-901oao.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-bnwqim.r-qvutc0",
    user_name: ".css-901oao.css-16my406.r-1tl8opc.r-bcqeeo.r-qvutc0",
    user_id: ".css-901oao.css-bfa6kz.r-18u37iz.r-1qd0xha.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0",
    timeline: "main",
    checked_tweet_class_name: "spam-tweets-compressor-checked",
    media: generate_media_selector(),
    verified_badge: "svg.r-jwli3a.r-4qtqp9.r-yyyyoo.r-1xvli5t.r-9cviqr.r-dnmrzs.r-bnwqim.r-1plcrui.r-lrvibr"
};


/***/ }),

/***/ "./src/tweet_analyser.ts":
/*!*******************************!*\
  !*** ./src/tweet_analyser.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TweetAnalyser": () => (/* binding */ TweetAnalyser)
/* harmony export */ });
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./selector */ "./src/selector.ts");

class TweetAnalyser {
    constructor(tweet) {
        this.tweet = tweet;
        this.content_element = tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.tweet_content);
    }
    get_content() {
        if (!this.content_element)
            return "";
        return this.content_element.textContent || "";
    }
    get_user_name() {
        const user_name_element = this.tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.user_name);
        if (user_name_element)
            return user_name_element.textContent || "";
        else
            return "";
    }
    get_user_id() {
        const user_id_element = this.tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.user_id);
        if (user_id_element)
            return user_id_element.textContent || "";
        else
            return "";
    }
    async get_language() {
        const detect = await browser.i18n.detectLanguage(this.get_content());
        if (detect.isReliable)
            return detect.languages[0].language.replace(/-.*$/, "");
        else
            return "";
    }
    trim_leading_whitespace(text) {
        // eslint-disable-next-line no-irregular-whitespace
        const whitespace_regex = new RegExp(/^[ 　ㅤ]+/gm);
        if (typeof text === "string")
            return text.replace(whitespace_regex, "");
        else {
            if (text.childElementCount === 0)
                text.textContent = (text.textContent || "").replace(whitespace_regex, "");
            else {
                text.querySelectorAll("*").forEach((element) => {
                    if (element.childElementCount === 0) {
                        element.textContent = (element.textContent || "").replace(whitespace_regex, "");
                    }
                });
            }
            return (text.textContent || "").replace(whitespace_regex, "");
        }
    }
    normal_compressor(content_element, hide_media, trim_space) {
        const raw_content = content_element.innerHTML;
        this.tweet.dataset.rawHTML = raw_content;
        this.tweet.dataset.rawContent = this.tweet.content;
        if (trim_space)
            this.trim_leading_whitespace(content_element);
        const compressed_content = content_element.innerHTML.replaceAll("\n", "");
        if (content_element)
            content_element.innerHTML = compressed_content;
        if (trim_space)
            this.tweet.content = this.trim_leading_whitespace(this.tweet.content.replaceAll("\n", ""));
        else
            this.tweet.content = this.tweet.content.replaceAll("\n", "");
        const media = this.tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.media);
        if (media && hide_media)
            media.style.display = "none";
        const decompress_button = document.createElement("button");
        decompress_button.className = "decompress-button";
        const decompress_button_normal = browser.i18n.getMessage("decompress_button_normal");
        decompress_button.textContent = decompress_button_normal;
        content_element.appendChild(decompress_button);
        decompress_button.addEventListener("click", () => {
            content_element.innerHTML = this.tweet.dataset.rawHTML || "";
            this.tweet.content = this.tweet.dataset.rawContent || "";
            if (media && hide_media)
                media.style.display = "block";
            decompress_button.remove();
        });
    }
    strict_compressor() {
        const decompress_button = document.createElement("button");
        decompress_button.setAttribute("class", this.tweet.getAttribute("class") || "");
        decompress_button.classList.add("show-tweet-button");
        const text_color = (() => {
            const user_name_element = this.tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.user_name);
            if (user_name_element)
                return getComputedStyle(user_name_element).getPropertyValue("color");
            else
                return "#1da1f2";
        })();
        decompress_button.style.color = text_color;
        const user_name = this.tweet.user_name;
        const user_id = this.tweet.user_id;
        const button_text = browser.i18n.getMessage("decompress_button_strict", [user_name, user_id]);
        decompress_button.textContent = button_text;
        decompress_button.addEventListener("click", () => {
            this.tweet.style.display = "block";
            decompress_button.remove();
        });
        this.tweet.style.display = "none";
        this.tweet.insertAdjacentElement("afterend", decompress_button);
    }
    compress(compressor_mode, hide_media, trim_leading_whitespace) {
        const content_element = this.tweet.querySelector(_selector__WEBPACK_IMPORTED_MODULE_0__.selector.tweet_content);
        if (!content_element)
            return;
        if (compressor_mode === "normal")
            this.normal_compressor(content_element, hide_media, trim_leading_whitespace);
        else
            this.strict_compressor();
    }
}


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
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _detect_spam__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./detect_spam */ "./src/detect_spam.ts");
/* harmony import */ var _load_setting__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./load_setting */ "./src/load_setting.ts");
/* harmony import */ var _selector__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./selector */ "./src/selector.ts");
/* harmony import */ var _tweet_analyser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./tweet_analyser */ "./src/tweet_analyser.ts");




function get_unchecked_tweets() {
    const tweets = document.querySelectorAll(`${_selector__WEBPACK_IMPORTED_MODULE_2__.selector.tweet_outer}:not(.${_selector__WEBPACK_IMPORTED_MODULE_2__.selector.checked_tweet_class_name})`);
    const result = [];
    function get_ready(tweet) {
        tweet.classList.add(_selector__WEBPACK_IMPORTED_MODULE_2__.selector.checked_tweet_class_name);
        const analyser = new _tweet_analyser__WEBPACK_IMPORTED_MODULE_3__.TweetAnalyser(tweet);
        tweet.content = analyser.get_content();
        tweet.user_name = analyser.get_user_name();
        tweet.user_id = analyser.get_user_id();
        tweet.language = analyser.get_language();
        tweet.compress = (compressor_mode, hide_media, trim_leading_whitespace) => {
            analyser.compress(compressor_mode, hide_media, trim_leading_whitespace);
        };
        result.push(tweet);
    }
    tweets.forEach(get_ready);
    return result;
}
async function run_check(setting) {
    const exclude_url = setting.exclude_url;
    if (exclude_url.includes(location.href))
        return;
    const check_target = get_unchecked_tweets();
    const compressor_mode = setting.strict_mode ? "strict" : "normal";
    const hide_media = setting.hide_media;
    const trim_leading_whitespace = setting.trim_leading_whitespace;
    for (let i = 0; i < check_target.length; i++) {
        const target = check_target[i];
        const is_spam = await (0,_detect_spam__WEBPACK_IMPORTED_MODULE_0__.detect_spam)(target, setting);
        if (is_spam)
            target.compress(compressor_mode, hide_media, trim_leading_whitespace);
    }
}
void (async () => {
    const setting = await (0,_load_setting__WEBPACK_IMPORTED_MODULE_1__.load_setting)();
    const body_observer_target = document.body;
    const body_observer = new MutationObserver(() => {
        const timeline = document.querySelector(_selector__WEBPACK_IMPORTED_MODULE_2__.selector.timeline);
        if (timeline) {
            body_observer.disconnect();
            const main_observer_target = timeline;
            const main_observer = new MutationObserver(() => {
                void run_check(setting);
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

})();

/******/ })()
;