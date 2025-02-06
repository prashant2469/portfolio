console.log('ITS ALIVE!');

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

// Create the color scheme switcher
document.body.insertAdjacentHTML(
    'afterbegin',
    `
  <label class="color-scheme">
    Theme:
    <select id="theme-selector">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);


// Function to set the color scheme


// Set the initial value based on the OS color scheme or localStorage
const themeSelector = document.getElementById('theme-selector');
if (localStorage.colorScheme) {
    themeSelector.value = localStorage.colorScheme; // Set to saved preference
    setColorScheme(localStorage.colorScheme); // Apply the saved color scheme
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeSelector.value = "dark"; // Set to dark if OS is in dark mode
    setColorScheme("dark");
} else {
    themeSelector.value = "light"; // Set to light if OS is in light mode
    setColorScheme("light"); // Apply light mode
}

// Add event listener to change the color scheme
themeSelector.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    setColorScheme(event.target.value); // Call the function to set the color scheme
});

function setColorScheme(colorScheme) {
    document.documentElement.style.setProperty('color-scheme', colorScheme);
    localStorage.colorScheme = colorScheme; // Save preference to localStorage

    // Update CSS variables for background and text colors
    if (colorScheme === 'light') {
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#000000');
        document.documentElement.style.setProperty('--border-color', 'oklch(50% 10% 200 / 40%)'); // Light border color
    } else if (colorScheme === 'dark') {
        document.documentElement.style.setProperty('--background-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
        document.documentElement.style.setProperty('--border-color', 'oklch(80% 3% 200 / 40%)'); // Dark border color
    }

    // Update nav styles immediately
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
        nav.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        nav.style.borderBottomColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    }
}
// Ensure the nav bar is updated on page load
window.addEventListener('load', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        nav.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
        nav.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
        nav.style.borderBottomColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    }
});

// Define the pages for the navigation menu for LOCAL
// let pages = [
//     { url: '../index.html', title: 'Home' }, //change when pushing ../
//     { url: '../projects/index.html', title: 'Projects' },
//     { url: '../contact/index.html', title: 'Contact' },
//     { url: '../resume/index.html', title: 'Resume' },
//     { url: 'https://github.com/prashant2469', title: 'GitHub Profile' }// External link

// ];


let pages = [
    { url: 'index.html', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'resume/index.html', title: 'Resume' },
    { url: 'https://github.com/prashant2469', title: 'GitHub Profile' }// External link

];

// Create a new <nav> element and prepend it to the body
let nav = document.createElement('nav');
document.body.prepend(nav);

// Check if we are on the home page
const ARE_WE_HOME = document.documentElement.classList.contains('home');

const BASE_PATH = '/portfolio/';

for (let p of pages) {
    let url = p.url; // This should not have a leading slash
    let title = p.title;

    // Handle external links
    if (url.startsWith('http')) {
        let a = document.createElement('a');
        a.href = url;
        a.textContent = title;
        a.target = '_blank';
        nav.append(a);
        continue;
    }

    // Adjust the URL if we are not on the home page
    if (!ARE_WE_HOME) {
        url = '/portfolio/' + url;
    }

    // Create the link element
    let a = document.createElement('a');
    a.href = url; // Set the href to the URL from the pages array
    a.textContent = title;

    // Highlight the current page link
    a.classList.toggle(
        'current',
        a.pathname === location.pathname
    );

    // Open external links in a new tab
    if (a.host !== location.host) {
        a.target = '_blank';
    }

    // Append the link to the nav
    nav.append(a);
}

// Function to fetch JSON data
export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }

        // Log the response object to inspect it
        console.log(response);

        // Parse the JSON data
        const data = await response.json();
        return data; // Return the parsed data

    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}


// Function to render project details
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
        img.src = project.image || "path/to/placeholder-image.png";
        img.alt = project.title;

        const description = document.createElement("p");
        description.textContent = project.description;

        // Add year under the description
        const year = document.createElement("p");
        year.textContent = `c. ${project.year || "2024"}`;
        year.style.fontStyle = "italic";
        year.style.fontFamily = "Baskerville, serif"; // Optional styling
        year.style.fontVariantNumeric = "oldstyle-nums"; // To match the style in the lab screenshot

        const textContainer = document.createElement("div");
        textContainer.appendChild(description);
        textContainer.appendChild(year); // Wrap description and year in same div

        article.appendChild(title);
        article.appendChild(img);
        article.appendChild(textContainer);

        containerElement.appendChild(article);
    });
}


export async function fetchGitHubData(username) {
    // Fetch data from the GitHub API for the specified username
    return fetchJSON(`https://api.github.com/users/${username}`);
}