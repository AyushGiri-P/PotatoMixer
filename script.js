const searchForm = document.querySelector("form");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const statusEl = document.getElementById("status");

function setStatus(message, type = "") {
    statusEl.textContent = message;
    statusEl.className = type; // "loading", "error", or ""
}

function showLoading(query) {
    results.innerHTML = "";
    setStatus(`Searching for "${query}"…`, "loading");
}

function showEmpty() {
    results.innerHTML = "";
    setStatus("No results for that word. Try another search.", "empty");
}

function showError() {
    results.innerHTML = "";
    setStatus("Something went wrong. Please try again.", "error");
}

function renderImages(pages) {
    results.innerHTML = "";

    pages.forEach((page) => {
        const info = page.imageinfo[0];

        const card = document.createElement("div");
        card.className = "card";

        const image = document.createElement("img");
        image.src = info.thumburl || info.url;
        image.alt = page.title.replace("File:", "");

        const title = document.createElement("h3");
        title.textContent = page.title.replace("File:", "");

        card.appendChild(image);
        card.appendChild(title);
        results.appendChild(card);
    });
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=400&format=json&origin=*`;

    showLoading(query); // before fetch

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();

        const pages = Object.values(data.query?.pages || {})
            .filter((page) => page.imageinfo && page.imageinfo.length > 0)
            .sort((a, b) => a.index - b.index);

        if (pages.length === 0) {
            showEmpty();
            return;
        }

        renderImages(pages);
        setStatus(`Showing ${pages.length} results for "${query}"`);
    } catch (error) {
        console.error(error);
        showError();
    }
});