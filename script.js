const searchForm = document.querySelector("form");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const emptyState = document.getElementById("emptyState");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();

    if (!query) {
        return;
    }

    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

    const response = await fetch(url);

    if (!response.ok) {
        return;
    }

    const data = await response.json();

    const pages = Object.values(data.query?.pages || {});

    results.innerHTML = "";

    emptyState.textContent = `Showing ${pages.length} results for "${query}"`;

    pages.forEach((page) => {
        const card = document.createElement("div");

        const image = document.createElement("img");
        image.src = page.imageinfo[0].thumburl || page.imageinfo[0].url;
        image.alt = page.title;

        const title = document.createElement("h3");
        title.textContent = page.title.replace("File:", "");

        card.appendChild(image);
        card.appendChild(title);

        results.appendChild(card);
    });
});