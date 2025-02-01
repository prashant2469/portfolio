import { fetchJSON, renderProjects } from '../global.js';

async function loadProjects() {
    const projectsContainer = document.querySelector('.projects');
    const projectsTitle = document.querySelector('.projects-title');

    if (!projectsContainer) {
        console.error('Projects container not found.');
        return;
    }

    try {
        // Fetch projects data
        const projects = await fetchJSON('../lib/projects.json');

        console.log('Projects fetched:', projects); // Debugging line

        // Render projects dynamically
        renderProjects(projects, projectsContainer, 'h2');

        // Update the project count dynamically
        if (projectsTitle) {
            projectsTitle.textContent = `${projects.length} Projects`;
            console.log('Updated projects title:', projects.length); // Debugging line
        } else {
            console.warn('Projects title element not found.');
        }
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

loadProjects();