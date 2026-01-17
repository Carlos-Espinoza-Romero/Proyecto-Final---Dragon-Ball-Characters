let characters = []
let favorites = JSON.parse(localStorage.getItem('db-favorites')) ?? [];
let currentPage = 1;
let totalPages = 0;

const API_URL = 'https://dragonball-api.com/api/characters';

/* Selectores del DOM */

const characterList = document.querySelector('#characterList');
const favCountLabel = document.querySelector('#favCount');
const currentPageLabel = document.querySelector('#currentPage');
const totalPagesLabel = document.querySelector('#totalPages');

/* Función para obtener personajes (Fetch) */
const fetchCharacters = async (page = 1) => {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=8`);

        const data = await response.json();

        totalPages = data.meta.totalPages;

        return data.items.map(char => ({

            ...char,
            isFavorite: favorites.some(fav => fav.id === char.id)

        }));
    } catch (error) {
        console.error('Error al cargar los personajes:', error);
        return [];
    }
};

/* Funcion para renderizar el DOM */
const renderCharacters = (items) => {
    characterList.innerHTML = '';

    items.forEach(char => {
        const card = document.createElement('article');
        card.className = 'character-card'; 

        card.innerHTML = `
      <img src="${char.image}" alt="${char.name}" class="character-img">
      <div class="character-info">
        <h2>${char.name}</h2>
        <p><strong>Raza:</strong> ${char.race}</p>
        <p><strong>Género:</strong> ${char.gender}</p>
        <button class="btn-fav ${char.isFavorite ? 'is-favorite' : ''}" 
                onclick="toggleFavorite(${char.id})">
          ❤
        </button>
      </div>
    `;
        characterList.appendChild(card);
    });

    currentPageLabel.textContent = currentPage;
    
    totalPagesLabel.textContent = totalPages;

    favCountLabel.textContent = `Favoritos: ${favorites.length} ❤️`
    

};

// Función para alternar favoritos
window.toggleFavorite = (id) => {
    const char = characters.find(c => c.id === id);
    
    const index = favorites.findIndex(f => f.id === id);

    if (index > -1) {
        favorites.splice(index, 1); 
    } else {
        favorites.push(char);
    }

    localStorage.setItem('db-favorites', JSON.stringify(favorites));

    
    characters = characters.map(c => ({
        ...c,
        isFavorite: favorites.some(fav => fav.id === c.id)

    })); 

    renderCharacters(characters);
};

// Controles de Paginación
document.querySelector('#nextPage').addEventListener('click', async () => {
    if (currentPage < totalPages) {
        currentPage++;
        characters = await fetchCharacters(currentPage);
        renderCharacters(characters);
    }
}); 

document.querySelector('#prevPage').addEventListener('click', async () => {
    if (currentPage > 1) {
        currentPage--;
        characters = await fetchCharacters(currentPage);
        renderCharacters(characters);
    }
});

document.querySelector('#firstPage').addEventListener('click', async () => {
    currentPage = 1;
    characters = await fetchCharacters(currentPage);
    renderCharacters(characters);
});

document.querySelector('#lastPage').addEventListener('click', async () => {
    currentPage = totalPages;
    characters = await fetchCharacters(currentPage);
    renderCharacters(characters);
});



(async () => {
    characters = await fetchCharacters(currentPage);
    renderCharacters(characters);
})();