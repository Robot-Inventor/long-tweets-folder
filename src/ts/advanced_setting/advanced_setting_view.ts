import "@material/mwc-dialog";
import "@material/mwc-button";
import { CheckListItem } from "@material/mwc-list/mwc-check-list-item";
import { initialize_tooltip } from "./../common/tooltip";
import { is_error } from "../types/common/type_predicate_utility";

/**
 * Shift the scroll position by the height of the header.
 */
const adjust_scroll_position = () => {
    const header_height = -64;
    const offset_x = 0;
    scrollBy(offset_x, header_height);
};

/**
 * Create a separator element for the ``mwc-list`` element.
 * @returns separator element
 */
const create_separator = (): HTMLLIElement => {
    const separator = document.createElement("li");
    separator.setAttribute("divider", "");
    separator.setAttribute("role", "separator");
    return separator;
};

/**
 * Generate ``mwc-check-list-item`` for the filter list of Advanced Filters.
 * @param filter_name name of the filter
 * @param filter_id id of the filter
 * @param selected default status
 * @returns ``mwc-check-list-item``
 */
const generate_check_list_item = (filter_name: string, filter_id: string, selected: boolean): CheckListItem => {
    const checkbox = document.createElement("mwc-check-list-item");
    checkbox.textContent = filter_name;
    checkbox.setAttribute("left", "");
    checkbox.dataset.filterId = filter_id;
    if (selected) checkbox.setAttribute("selected", "");
    return checkbox;
};

/**
 * Set header color as brighten color of document's background color and set border for bottom of the header.
 * @param background_color background color of document
 */
const adjust_appearance = (): void => {
    const header = document.querySelector("mwc-top-app-bar-fixed");
    if (!header) {
        console.error("mwc-top-app-bar-fixed was not found.");
        return;
    }

    const header_shadow = header.shadowRoot;
    if (header_shadow) {
        const header_inner = header_shadow.querySelector("header");
        if (!header_inner) return;

        header_inner.style.borderBottom = "0.1rem solid rgba(0, 0, 0, 0.1)";
    }
};

/**
 * Initialize menu.
 */
class Menu {
    private readonly open_button: HTMLElement | null;
    private readonly item_outer: HTMLElement | null;
    private readonly close_button: HTMLElement | null;

    constructor() {
        this.open_button = document.getElementById("menu_open_button");
        this.item_outer = document.getElementById("menu_item_outer");
        this.close_button = document.getElementById("menu_close_button");

        if (this.close_button) this.close_button.addEventListener("click", () => this.hide());
        else console.error("#menu_close_button was not found.");

        this.init_menu_item();
        Menu.init_menu_button();
        this.initialize_ripple();
    }

    private init_menu_item() {
        [...document.querySelectorAll("h2")].reverse().forEach((element) => {
            if (getComputedStyle(element).display !== "none" && element.textContent && this.item_outer) {
                const menu_item = document.createElement("div");
                menu_item.className = "menu_item";
                menu_item.innerHTML = element.innerHTML;
                menu_item.addEventListener("click", () => {
                    location.hash = element.id;
                    adjust_scroll_position();
                });
                this.item_outer.insertAdjacentElement("afterbegin", menu_item);
            }
        });
    }

    private static init_menu_button() {
        const drawer = document.querySelector("mwc-drawer");
        if (drawer) {
            const container = drawer.parentNode;
            if (container) {
                container.addEventListener("MDCTopAppBar:nav", () => {
                    drawer.open = !drawer.open;
                });
            }
        }
    }

    private hide() {
        if (this.open_button) this.open_button.click();
    }

    private initialize_ripple() {
        if (!this.item_outer) {
            console.error("menu_item_outer was not found.");
            return;
        }

        const menu_item = this.item_outer.querySelectorAll(".menu_item");
        menu_item.forEach((item) => {
            const ripple = document.createElement("mwc-ripple");
            item.appendChild(ripple);

            item.addEventListener("mousedown", (event) => {
                ripple.startPress(event);
            });
            item.addEventListener("mouseup", () => {
                ripple.endPress();
            });
            item.addEventListener("mouseover", () => {
                ripple.startHover();
            });
            item.addEventListener("mouseleave", () => {
                ripple.endHover();
                ripple.endPress();
            });
        });
    }
}

const show_alert = (message: string) => {
    try {
        const dialog = document.createElement("mwc-dialog");

        const text_outer = document.createElement("pre");
        text_outer.style.whiteSpace = "pre-wrap";
        text_outer.textContent = message;

        const ok_button = document.createElement("mwc-button");
        ok_button.slot = "primaryAction";
        ok_button.setAttribute("dialogAction", "ok");
        ok_button.textContent = "OK";

        dialog.appendChild(text_outer);
        dialog.appendChild(ok_button);

        dialog.addEventListener("closed", () => {
            dialog.remove();
        });

        document.body.appendChild(dialog);
        dialog.show();
    } catch (error) {
        // eslint-disable-next-line no-alert
        alert(message);
        if (is_error(error)) console.error(error);
    }
};

new Menu();
initialize_tooltip();

window.addEventListener("load", () => {
    if (location.hash) {
        const target_element = document.querySelector(location.hash);
        if (target_element) {
            target_element.scrollIntoView();
            adjust_scroll_position();
        } else {
            console.error(`${location.hash} was not found.`);
        }
    }
});

export { create_separator, generate_check_list_item, adjust_appearance, show_alert };
