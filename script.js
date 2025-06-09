const searchInput = document.getElementById("searchInput");
const radios = document.querySelectorAll(".radio");
const characterContainer = document.getElementById("characterContainer");
const navigation = document.getElementById("navigation");
const prevButton = document.getElementById("prevButton");
const nextButton = document.getElementById("nextButton");

const API_URL = "http://localhost:3000/characters";
let currentPage = 1;
const totalPages = 4;
const elementsPerPage = 5;
let currentStatus = "Alive";

radios.forEach((radio) => {
  radio.addEventListener("change", function () {
    if (radio.checked) {
      currentStatus = radio.value;
      currentPage = 1;
      characterContainer.innerHTML = "";
      getCharacters();
    }
  });
});

let searchedCharacter = "";

searchInput.addEventListener("input", function () {
  searchedCharacter = searchInput.value.trim();
  currentPage = 1;
  characterContainer.innerHTML = "";
  getCharacters();
});

const getCharacters = async function () {
  try {
    const paginationParams = `?_page=${currentPage}&_limit=${elementsPerPage}`;
    const statusParams = `&status=${currentStatus}`;
    const searchedNameParams = `&name_like=${searchedCharacter}`;
    const response = await fetch(
      `${API_URL}${paginationParams}${statusParams}${searchedNameParams}`
    );
    const characters = await response.json();
    const results = characters;
    createCharacterCard(results);
  } catch (error) {
    console.error("Failed to fetch character:", error);
    characterContainer.textContent = `Brak elementów do wyświetlenia`;
  }
};

getCharacters();

function createCharacterCard(results) {
  if (results.length === 0) {
    const message = document.createElement("h3");
    message.textContent = "Brak wyników do wyświetlenia";
    characterContainer.append(message);
    return;
  }

  results.forEach((result) => {
    const characterCard = document.createElement("div");
    characterCard.classList.add("characterCard");
    characterContainer.append(characterCard);

    const characterImg = document.createElement("img");
    characterImg.src = result.image;
    characterCard.append(characterImg);
    characterImg.classList.add("characterIMG");

    const characterName = document.createElement("h3");
    characterName.textContent = result.name;
    characterCard.append(characterName);

    const characterStatus = document.createElement("p");
    characterStatus.textContent = result.status;
    characterCard.append(characterStatus);

    const characterSpecies = document.createElement("p");
    characterSpecies.textContent = result.species;
    characterCard.append(characterSpecies);

    const characterButton = document.createElement("button");
    characterButton.textContent = "Usuń postać";
    characterCard.append(characterButton);
    characterButton.id = "characterButton";
    characterButton.addEventListener("click", deleteCard);
  });
}

async function deleteCard() {
  try {
    this.parentNode.remove();
    const parent = this.parentNode;
    const img = parent.querySelector("img");
    const url = img.src;
    const array = url.split("/").pop();
    const arraysecond = array.split(".");
    const id = arraysecond[0];
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    console.log(`character deleted`);
  } catch (error) {
    console.error("failed to delete character", error);
  }
}

function paginationNext() {
  if (currentPage < totalPages) {
    currentPage++;
    characterContainer.innerHTML = "";
    getCharacters();
  }
}

nextButton.addEventListener("click", paginationNext);

function paginationPrevius() {
  if (currentPage > 1) {
    currentPage--;
    characterContainer.innerHTML = "";
    getCharacters();
  }
}

prevButton.addEventListener("click", paginationPrevius);

const createNameInput = document.getElementById("createName");
const createStatus = document.getElementById("createStatus");
const createSpeciesInput = document.getElementById("createSpecies");
const sendingButton = document.getElementById("sendingButton");

sendingButton.addEventListener("click", createandsendNewCharacter);

async function createandsendNewCharacter() {
  const name = createNameInput.value.trim();
  const status = createStatus.value;
  const species = createSpeciesInput.value.trim();

  const newCharacter = {
    name: `${name}`,
    status: `${status}`,
    species: `${species}`,
    image: "https://rickandmortyapi.com/api/character/avatar/3.jpeg",
  };
  try {
    const response = await fetch(`${API_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCharacter),
    });
    
    createNameInput.value = "";
    createStatus.value = "";
    createSpeciesInput.value = "";
    characterContainer.innerHTML = "";
    getCharacters();

  } catch (error) {
    console.error("Błąd dodawania:", error);
  }
}

