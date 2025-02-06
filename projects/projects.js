import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

// Select the projects container
const projectsContainer = document.querySelector('.projects');
let query = ''; // Holds the search query
let allProjects = []; // Store all projects globally
let selectedYear = null; // Stores the currently selected year for filtering

// Function to load and render projects
async function loadProjects() {
    try {
        // const projects = await fetchJSON('../lib/projects.json'); //for local
        const projects = await fetchJSON('/portfolio/lib/projects.json');

        allProjects = projects; // Store original projects data

        // Update the projects count in the title
        const projectsTitle = document.querySelector('.projects-title');
        if (Array.isArray(projects)) {
            projectsTitle.textContent = `${projects.length} Projects`;
        }

        // Render projects and pie chart
        filterAndRenderProjects();
    } catch (error) {
        console.error('Error loading projects:', error);
    }
}

// Function to filter and render projects
function filterAndRenderProjects() {
    let filteredProjects = allProjects.filter((project) => {
        let values = Object.values(project).join(' ').toLowerCase();
        return values.includes(query.toLowerCase());
    });

    // Apply year filter if a wedge is selected
    if (selectedYear) {
        filteredProjects = filteredProjects.filter(project => project.year === selectedYear);
    }

    // Update displayed projects
    renderProjects(filteredProjects, projectsContainer, 'h2');

    // Update pie chart with filtered data
    generatePieChart(filteredProjects);
}

// Add event listener to search bar
const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase(); // Ensure case-insensitive search
    filterAndRenderProjects();
});

// Function to generate pie chart
function generatePieChart(projects) {
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2;

    let rolledData = d3.rollups(
        projects,
        (v) => v.length,
        (d) => d.year
    );

    let data = rolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    if (data.length === 0) {
        console.log("No valid data for pie chart!");
        return;
    }

    const svg = d3.select("#projects-pie-plot")
        .attr("width", width)
        .attr("height", height)
        .html("")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    const pie = d3.pie().value(d => d.value);
    const pieData = pie(data);
    const arcGenerator = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

    const slices = svg.selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arcGenerator)
        .attr("fill", (d, i) => colorScale(i))
        .attr("stroke", "#fff")
        .style("stroke-width", "2px")
        .style("cursor", "pointer")
        .on("click", function (event, d) {
            if (selectedYear === d.data.label) {
                selectedYear = null;
            } else {
                selectedYear = d.data.label;
            }
            filterAndRenderProjects();
        });

    // Create a legend dynamically
    const legend = d3.select(".legend")
        .html("")
        .selectAll("li")
        .data(data)
        .enter()
        .append("li")
        .attr("class", "legend-item")
        .style("display", "flex")
        .style("align-items", "center")
        .style("cursor", "pointer")
        .html(d => `
            <span class="swatch" style="background:${colorScale(d.label)};"></span> 
            ${d.label} <em>(${d.value})</em>
        `)
        .on("click", function (event, d) {
            if (selectedYear === d.label) {
                selectedYear = null;
            } else {
                selectedYear = d.label;
            }
            filterAndRenderProjects();
        });

    // Update the highlighting of selected wedges and legend items
    slices.classed("selected-wedge", d => d.data.label === selectedYear)
        .classed("unselected-wedge", d => selectedYear && d.data.label !== selectedYear);

    legend.classed("selected", d => d.label === selectedYear)
        .classed("dimmed", d => selectedYear && d.label !== selectedYear);
}

// Load projects when the script runs
loadProjects();
