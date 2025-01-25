console.log('IT’S ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const navLinks = $$("nav a");
const currentLink = navLinks.find((a) =>
    a.host === location.host && a.pathname === location.pathname
);

currentLink?.classList.add("current");

const toggleButton = document.getElementById("theme-toggle");

// Check for saved theme in localStorage and apply it
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
    toggleButton.textContent = savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

// Add an event listener to toggle dark mode
toggleButton.addEventListener("click", () => {
    // Get the current theme
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    // Set the new theme
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme); // Save the theme in localStorage

    // Update the button text
    toggleButton.textContent = newTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
});

let pages = [
    { url: "/index.html", title: "Home" },
    { url: "/projects/index.html", title: "Projects" },
    { url: "/contact/index.html", title: "Contact" },
    { url: "/resume/index.html", title: "Resume" },
    { url: "https://github.com/prashant2469", title: "GitHub" },
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

// Create a new navigation element
let nav = document.createElement('nav');
nav.className = 'navbar';

// Iterate through pages and create navigation links
pages.forEach(page => {
    let url = page.url;
    url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;

    let link = document.createElement('a');
    link.href = url;
    link.textContent = page.title;

    // Add target="_blank" for external links
    if (url.startsWith('http')) {
        link.setAttribute('target', '_blank');
    }

    // Highlight the current page
    if (location.host === link.host && location.pathname === link.pathname) {
        link.classList.add('current');
    }

    nav.append(link);
});

// Add the navigation bar to the beginning of the body
document.body.prepend(nav);


