import { fetchJSON, renderProjects } from './global.js';
import { fetchGitHubData } from './global.js';

document.addEventListener("DOMContentLoaded", async () => {
    const projectsContainer = document.querySelector(".projects");

    if (!projectsContainer) {
        console.error("Error: Projects container not found.");
        return;
    }

    try {
        const projects = await fetchJSON('./lib/projects.json');
        const latestProjects = projects.slice(0, 3);
        renderProjects(latestProjects, projectsContainer, 'h2');
    } catch (error) {
        console.error("Failed to load latest projects:", error);
    }
});

const profileStats = document.querySelector('#profile-stats');
async function loadGitHubProfile(username) {
    const githubData = await fetchGitHubData(username);

    if (profileStats && githubData) {
        profileStats.innerHTML = `
            <dl>
                <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
                <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
                <dt>Followers:</dt><dd>${githubData.followers}</dd>
                <dt>Following:</dt><dd>${githubData.following}</dd>
            </dl>
        `;
    }
}

// Call the function with your GitHub username
loadGitHubProfile('prashant2469');