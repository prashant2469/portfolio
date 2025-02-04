console.log('IT’S ALIVE!');

export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return null;
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    if (!Array.isArray(projects) || !containerElement) {
        console.error("Invalid arguments passed to renderProjects");
        return;
    }

    containerElement.innerHTML = ''; // Clear previous content

    projects.forEach(project => {
        const article = document.createElement("article");
        const title = document.createElement(headingLevel);
        title.textContent = project.title;

        const img = document.createElement("img");
        img.src = project.image;
        img.alt = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        article.appendChild(title);
        article.appendChild(img);
        article.appendChild(description);

        containerElement.appendChild(article);
    });
}

// Directly fetch and render projects
async function loadProjects() {
    const projectsContainer = document.querySelector(".projects");

    if (!projectsContainer) {
        console.error("Projects container not found");
        return;
    }

    const projects = await fetchJSON("../lib/projects.json");

    if (projects) {
        renderProjects(projects, projectsContainer, 'h3'); // Example with dynamic heading
    } else {
        projectsContainer.innerHTML = "<p>Failed to load projects.</p>";
    }
}

// Call loadProjects() directly instead of waiting for DOMContentLoaded
loadProjects();


const navLinks = $$("nav a");
const currentLink = navLinks.find((a) =>
    a.host === location.host && a.pathname === location.pathname
);

currentLink?.classList.add("current");



// Detect if running on GitHub Pages
const isGitHubPages = window.location.hostname.includes("github.io");
const basePath = isGitHubPages ? "/your-repo-name" : ""; // Change 'your-repo-name' to your GitHub repo name

// Pages list with dynamic paths
let pages = [
    { url: `${basePath}/index.html`, title: "Home" },
    { url: `${basePath}/projects/index.html`, title: "Projects" },
    { url: `${basePath}/contact/index.html`, title: "Contact" },
    { url: `${basePath}/resume/index.html`, title: "Resume" },
    { url: "https://github.com/prashant2469", title: "GitHub" },
];

const ARE_WE_HOME = document.documentElement.classList.contains("home");

// Prevent duplicate navbars
if (!document.querySelector(".navbar")) {
    let nav = document.createElement("nav");
    nav.className = "navbar";

    pages.forEach((page) => {
        let link = document.createElement("a");
        link.href = page.url;
        link.textContent = page.title;

        if (page.url.startsWith("http")) {
            link.setAttribute("target", "_blank");
        }

        if (window.location.pathname === new URL(page.url, window.location.origin).pathname) {
            link.classList.add("current");
        }

        nav.append(link);
    });

    document.body.prepend(nav);
}

const toggleButton = document.getElementById("theme-toggle");

// Check for saved theme in localStorage and apply it
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
    document.body.setAttribute("data-theme", savedTheme);
    toggleButton.textContent = savedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
}

toggleButton.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);

    // Update button text immediately
    toggleButton.textContent = newTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
});