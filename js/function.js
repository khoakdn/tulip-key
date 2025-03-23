document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([51.4416, 5.4697], 12); // Eindhoven
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Move zoom control to the right
    map.zoomControl.setPosition('topright');

    // Fetch population density data from API
    fetch("https://data.eindhoven.nl/api/explore/v2.1/catalog/datasets/selectiontableasjsonashx/records?limit=100")
        .then(response => response.json())
        .then(data => {
            console.log("Full API Response:", data);
            data.results.forEach(record => {
                console.log("Record:", record);
                if (record.geo_point_2d) {
                    const { lon, lat } = record.geo_point_2d;
                    const populationDensity = record.population_density || "N/A";

                    let color = 'blue';
                    if (populationDensity > 1000) color = 'orange';
                    if (populationDensity > 3000) color = 'red';

                    L.circleMarker([lat, lon], {
                        radius: 6,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.6
                    }).addTo(map)
                    .bindPopup(`<strong>Population Density:</strong> ${populationDensity} per km²`);
                }
            });
        })
        .catch(error => console.error("Error fetching API data:", error));
});
