import {
    importScrollableHeightByElement,
    initializeNavById
} from "Shared/ts/applications/navigation";

const initializeNavUI = () => {
    const nav = initializeNavById("nav");
    if (!nav) return;

    importScrollableHeightByElement(nav.root);
};

initializeNavUI();
