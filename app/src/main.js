const SEARCH_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1/search?q=";

const OBJECT_URL =
  "https://collectionapi.metmuseum.org/public/collection/v1/objects/";

async function fetchArtwork(query) {
  try {
    const searchResponse = await fetch(`${SEARCH_URL}${query}`);
    if (!searchResponse.ok) {
      throw new Error(`Search error: ${searchResponse.status}`);
    }

    const searchData = await searchResponse.json();
    const objectIDs = searchData.objectIDs.slice(0, 200);

    const imgCard = document.getElementById("images");
    imgCard.innerHTML = "";

    if (!objectIDs || objectIDs.length === 0) {
      imgCard.innerHTML = "<p>No results found.</p>";
      return;
    }

    let displayedImage = 0;
    for (let objectID of objectIDs) {
      if (displayedImage === 12) break;
      const objectResponse = await fetch(`${OBJECT_URL}${objectID}`);
      if (!objectResponse.ok) {
        throw new Error(`Object error: ${objectResponse.status}`);
      }

      const objectData = await objectResponse.json();

      if (
        objectData.primaryImage &&
        !imgCard.querySelector(`img[src="${objectData.primaryImage}"]`)
      ) {
        imgCard.insertAdjacentHTML(
          "beforeend",
          `<div class="image-card cursor-pointer flex flex-col items-center">
       <img src="${objectData.primaryImage}" alt="${
            objectData.title
          }" class="w-32 h-auto m-2 rounded shadow" />
       <p class="hidden text-center text-sm mt-1 info">
         <strong>${objectData.title}</strong>
         ${
           objectData.artistDisplayName
             ? " by " + objectData.artistDisplayName
             : ""
         }
         ${objectData.objectDate ? " (" + objectData.objectDate + ")" : ""}
       </p>
     </div>`
        );

        const lastCard = imgCard.lastElementChild;
        lastCard.addEventListener("click", () => {
          const info = lastCard.querySelector(".info");
          info.classList.toggle("hidden"); // show/hide info on click
        });

        displayedImage++;
      }
    }
  } catch (error) {
    console.error(error.message);
  }
}

document.getElementById("searchButton").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim();
  if (query) fetchArtwork(query);
});

//a
