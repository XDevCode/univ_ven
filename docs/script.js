document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop();

    // Cargar partículas animadas
    particlesJS.load("particles-js", "particles.json", () => {
        console.log("Fondo de partículas cargado.");
    });

    if (currentPage === "index.html" || currentPage === "") {
        loadAreas();
    } else if (currentPage === "career.html") {
        const urlParams = new URLSearchParams(window.location.search);
        const areaId = urlParams.get("id");
        if (areaId) {
            loadCareers(areaId);
        } else {
            window.location.href = "/";
        }
    }
});

// Cargar áreas en la página principal
function loadAreas() {
    const areasList = document.getElementById("areas-list");

    fetch("https://univ-ven.onrender.com/api/areas")
        .then((response) => response.json())
        .then((areas) => {
            areas.forEach((area) => {
                const areaItem = document.createElement("div");
                areaItem.className = "list-item";
                areaItem.innerHTML = `
                    ${area.name}
                    <i class="fas fa-chevron-right"></i>
                `;

                // Redirigir a la página de carreras al hacer clic en un área
                areaItem.addEventListener("click", () => {
                    window.location.href = `career.html?id=${area.id}`;
                });

                areasList.appendChild(areaItem);
            });
        });
}

// Cargar carreras en la página de carreras
function loadCareers(areaId) {
    const careersList = document.getElementById("careers-list");
    const areaTitle = document.getElementById("area-title");

    fetch(`https://univ-ven.onrender.com/api/careers?area_id=${areaId}`)
        .then((response) => response.json())
        .then((careers) => {
            areaTitle.textContent = `Carreras del Área ${areaId}`;

            careers.forEach((career) => {
                const careerItem = document.createElement("div");
                careerItem.className = "list-item";
                careerItem.innerHTML = `
                    ${career.name} - ${career.description}
                    <i class="fas fa-chevron-down"></i>
                `;

                // Cargar universidades al hacer clic en una carrera
                careerItem.addEventListener("click", () => {
                    const icon = careerItem.querySelector("i");
                    const universityList = careerItem.querySelector(".university-list");

                    if (universityList) {
                        universityList.classList.toggle("active");
                        icon.classList.toggle("fa-chevron-down");
                        icon.classList.toggle("fa-chevron-up");
                    } else {
                        loadUniversities(career.id, careerItem);
                    }
                });

                careersList.appendChild(careerItem);
            });
        });
}

// Cargar universidades por carrera
function loadUniversities(careerId, parentElement) {
    fetch(`https://univ-ven.onrender.com/api/universities?career_id=${careerId}`)
        .then((response) => response.json())
        .then((universities) => {
            const universitiesList = document.createElement("ul");
            universitiesList.className = "university-list";

            universities.forEach((university) => {
                const li = document.createElement("li");
                li.textContent = university.name;
                universitiesList.appendChild(li);
            });

            // Agregar la lista de universidades al elemento padre
            parentElement.appendChild(universitiesList);
            universitiesList.classList.add("active");

            // Cambiar el ícono
            const icon = parentElement.querySelector("i");
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        });
}