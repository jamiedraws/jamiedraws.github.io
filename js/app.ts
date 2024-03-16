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

console.log("hello");

// components
import Carousel from "Shared/ts/components/carousel";

// adapters
import SlideCarouselAdapter from "Shared/ts/api/carousel/slide/adapters/slide-carousel";

// observers
import { observer } from "Shared/ts/observers/intersection";

observer(".slide--carousel", {
    inRange: (element) => {
        const carousel = new Carousel(new SlideCarouselAdapter(element));

        carousel.enablePrevNextControls();
    }
});
