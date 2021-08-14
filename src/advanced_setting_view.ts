class Menu {
    private readonly overlay: HTMLElement | null;
    private readonly menu: HTMLElement | null;
    private readonly item_outer: HTMLElement | null;
    private readonly open_button: HTMLElement | null;
    private readonly close_button: HTMLElement | null;
    private readonly header: HTMLElement | null;
    private readonly open_attribute: string;

    constructor() {
        this.overlay = document.getElementById("overlay");
        this.menu = document.getElementById("menu");
        this.item_outer = document.getElementById("menu_item_outer");
        this.open_button = document.getElementById("menu_open_button");
        this.close_button = document.getElementById("menu_close_button");
        this.header = document.querySelector("header");
        this.open_attribute = "data-open";

        if (this.open_button) {
            this.open_button.addEventListener("click", () => {
                this.show();
            });
        } else {
            console.error("#menu_open_button was not found.");
        }

        if (this.close_button) {
            this.close_button.addEventListener("click", () => {
                this.hide();
            });
        } else {
            console.error("#menu_close_button was not found.");
        }

        if (this.overlay) {
            this.overlay.addEventListener("click", () => {
                this.hide();
            });
        } else {
            console.error("#overlay was not found.");
        }

        [...document.querySelectorAll("h2")].reverse().forEach((element) => {
            if (getComputedStyle(element).display !== "none" && element.textContent && this.item_outer) {
                const menu_item = document.createElement("div");
                menu_item.className = "menu_item";
                menu_item.textContent = element.textContent;
                menu_item.addEventListener("click", () => {
                    location.hash = element.id;
                    if (this.header) scrollBy(0, parseInt(getComputedStyle(this.header).height.replace(/px$/, "")) * -2);
                    else console.error("header was not found.");
                });
                this.item_outer.insertAdjacentElement("afterbegin", menu_item);
            }
        });
    }

    private show() {
        if (!this.menu) {
            console.error("#menu was not found.");
            return;
        } else {
            this.menu.setAttribute(this.open_attribute, "");
            if (this.overlay) this.overlay.style.display = "block";
            else console.error("#overlay was not found.");
        }
    }

    private hide() {
        if (!this.menu) {
            console.error("#menu was not found.");
            return;
        } else {
            this.menu.removeAttribute(this.open_attribute);
            if (this.overlay) this.overlay.style.display = "none";
            else console.error("#overlay was not found.");
        }
    }
}

new Menu();
