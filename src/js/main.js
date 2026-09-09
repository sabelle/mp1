
/* =========================================
   NAVBAR
========================================= */
const navBrand = document.querySelector(".nav-brand");
const navbar = document.querySelector("#navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section");


/**
 * Changes the navbar between its large and small
 * versions based on the user's scroll position.
 */
function updateNavbarSize() {
    if (window.scrollY > 40) {
        navbar.classList.add("navbar-small");
    } else {
        navbar.classList.remove("navbar-small");
    }
}


/**
 * Removes the active class from every navigation
 * link and gives it to the link whose href matches
 * the supplied section ID.
 *
 * @param {string} sectionId - ID of the active section.
 */
function setActiveNavLink(sectionId) {
    navLinks.forEach((link) => {
        const targetId = link.getAttribute("href").substring(1);

        if (targetId === sectionId) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}


/**
 * Determines which section is directly underneath
 * the bottom of the navbar and highlights that
 * section's navigation link.
 *
 * getBoundingClientRect() gives each section's
 * position relative to the current viewport.
 *
 * The special bottom-of-page check ensures the final
 * Hobbies navigation item is highlighted when the
 * user scrolls all the way to the bottom, as required
 * by the assignment.
 */
function updatePositionIndicator() {
    const navbarBottom = navbar.getBoundingClientRect().bottom;

    const scrollBottom = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    /*
     * If the user reaches the bottom of the page,
     * always highlight the final navigation item.
     */
    if (scrollBottom >= documentHeight - 2) {
        const lastSection = sections[sections.length - 1];

        setActiveNavLink(lastSection.id);
        return;
    }

    let currentSection = null; // start with no selection

    sections.forEach((section) => {
        const sectionPosition = section.getBoundingClientRect();

        /*
         * The active section is the most recent section
         * whose top has reached or passed the bottom
         * edge of the sticky navbar.
         */
        if (sectionPosition.top <= navbarBottom + 1) {
            currentSection = section;
        }
    });

    if (currentSection) {
        setActiveNavLink(currentSection.id);
    } else {
        setActiveNavLink("");
    }
}


/**
 * Smoothly scrolls the page to a selected section.
 *
 * A custom calculation is used instead of basic
 * scrollIntoView() so the sticky navbar does not
 * cover the section heading after scrolling.
 *
 * @param {Event} event - Navigation link click event.
 */
function handleNavigationClick(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const targetId = link.getAttribute("href");
    const targetSection = document.querySelector(targetId);

    if (!targetSection) {
        return;
    }

    const navbarHeight = navbar.offsetHeight;

    const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.scrollY -
        navbarHeight;

    window.scrollTo({
        top: targetPosition,
        behavior: "smooth"
    });
}


/**
 * Updates all scroll-dependent navbar features.
 *
 * Keeping these operations together means the
 * browser only needs one scroll event listener.
 */
function handlePageScroll() {
    updateNavbarSize();
    updatePositionIndicator();
}


/*
 * Add smooth scrolling to every navigation link.
 */
navLinks.forEach((link) => {
    link.addEventListener("click", handleNavigationClick);
});

/*
 * Add smooth scrolling  when clicking sabelle (navBrand).
 */
navBrand.addEventListener(
    "click",
    handleNavigationClick
);


const heroButton = document.querySelector(".hero-button");

/*
 * The hero button uses the same smooth-scrolling
 * behavior as the navigation links.
 */
if (heroButton) {
    heroButton.addEventListener("click", handleNavigationClick);
}


/*
 * Update the navbar whenever the page scrolls.
 */
window.addEventListener("scroll", handlePageScroll);


/*
 * Recalculate the active position when the browser
 * dimensions change because section and navbar
 * dimensions may also change.
 */
window.addEventListener("resize", updatePositionIndicator);


/* =========================================
   HOBBIES CAROUSEL
========================================= */

const carouselTrack = document.querySelector("#carousel-track");
const carouselSlides = document.querySelectorAll(".carousel-slide");
const previousButton = document.querySelector("#carousel-previous");
const nextButton = document.querySelector("#carousel-next");
const carouselDots = document.querySelectorAll(".carousel-dot");

let currentSlide = 0;


/**
 * Moves the carousel track so the selected slide
 * appears inside the carousel window.
 *
 * Each slide occupies 100% of the carousel width,
 * so translating by 100% for every index moves the
 * track exactly one full slide at a time.
 *
 * @param {number} slideIndex - Index of slide to display.
 */
function showSlide(slideIndex) {
    currentSlide = slideIndex;

    carouselTrack.classList.remove(
        "slide-position-0",
        "slide-position-1",
        "slide-position-2"
    );

    carouselTrack.classList.add(
        `slide-position-${currentSlide}`
    );

    updateCarouselDots();
}


/**
 * Updates the small carousel indicators underneath
 * the carousel so the active dot corresponds to the
 * currently displayed slide.
 */
function updateCarouselDots() {
    carouselDots.forEach((dot, index) => {
        if (index === currentSlide) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}


/**
 * Advances the carousel one slide to the right.
 *
 * If the current slide is the last slide, it wraps
 * back around to the first slide.
 */
function showNextSlide() {
    const nextSlide =
        (currentSlide + 1) % carouselSlides.length;

    showSlide(nextSlide);
}


/**
 * Moves the carousel one slide to the left.
 *
 * If the current slide is the first slide, it wraps
 * around to the final slide.
 */
function showPreviousSlide() {
    const previousSlide =
        (currentSlide - 1 + carouselSlides.length) %
        carouselSlides.length;

    showSlide(previousSlide);
}


/**
 * Reads the desired slide number from a carousel
 * indicator's data-slide attribute and moves the
 * carousel directly to that slide.
 *
 * @param {Event} event - Click event from a carousel dot.
 */
function handleCarouselDotClick(event) {
    const slideIndex = Number(
        event.currentTarget.dataset.slide
    );

    showSlide(slideIndex);
}


previousButton.addEventListener(
    "click",
    showPreviousSlide
);

nextButton.addEventListener(
    "click",
    showNextSlide
);

carouselDots.forEach((dot) => {
    dot.addEventListener(
        "click",
        handleCarouselDotClick
    );
});


/* =========================================
   MODAL
========================================= */

const aboutModal = document.querySelector("#about-modal");
const openModalButton = document.querySelector("#open-about-modal");
const closeModalButton = document.querySelector("#close-about-modal");
const modalOverlay = aboutModal.querySelector(".modal-overlay");


/**
 * Displays the About modal.
 *
 * It also updates aria-hidden for accessibility
 * and prevents the main page from scrolling while
 * the modal is open.
 */
function openAboutModal() {
    aboutModal.classList.add("show");
    aboutModal.setAttribute("aria-hidden", "false");

    document.body.classList.add("modal-open");

    closeModalButton.focus();
}


/**
 * Hides the About modal and restores normal page
 * scrolling.
 */
function closeAboutModal() {
    aboutModal.classList.remove("show");
    aboutModal.setAttribute("aria-hidden", "true");

    document.body.classList.remove("modal-open");

    openModalButton.focus();
}


/**
 * Allows the Escape key to close the modal.
 *
 * The modal is only closed if it is currently
 * visible.
 *
 * @param {KeyboardEvent} event - Keyboard event.
 */
function handleModalKeyboard(event) {
    if (
        event.key === "Escape" &&
        aboutModal.classList.contains("show")
    ) {
        closeAboutModal();
    }
}


openModalButton.addEventListener(
    "click",
    openAboutModal
);

closeModalButton.addEventListener(
    "click",
    closeAboutModal
);

/*
 * Clicking the dark overlay outside the modal
 * content also closes the modal.
 */
modalOverlay.addEventListener(
    "click",
    closeAboutModal
);

document.addEventListener(
    "keydown",
    handleModalKeyboard
);


/* =========================================
   INITIAL PAGE STATE
========================================= */

/**
 * Sets the correct navbar appearance and active
 * section when the page initially loads.
 *
 * This matters if the browser restores the user's
 * previous scroll position after refreshing.
 */
function initializePage() {
    updateNavbarSize();
    updatePositionIndicator();
    showSlide(0);
}

initializePage();