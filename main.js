import './style.css'
import {parseDeckFile, parseLibraryFile} from "./parsing";
import {combineCardsByName, getMissingCards} from "./diffing";
import {getDataByName, getImageUrisForCard} from "./scryfall";

function formatCard(card) {
    return `${card.amount} ${card.name}`;
}

const localStorageKey = 'libraryCards';

window.addEventListener('load', () => {
    const deckEle = document.querySelector('#deck');
    const libraryEle = document.querySelector('#library');
    const checkbox = document.querySelector('#localstorage');
    const form = document.querySelector('#form');
    const outputEle = document.querySelector('#output');
    const storeInLocalStorageButton = document.querySelector('#store-in-localstorage');
    const createProxiesButton = document.querySelector('#create-proxies');
    const proxyImages = document.querySelector('#proxy-images');

    let useLocalStorage = !!checkbox.checked;
    checkbox.addEventListener('input', (e) => {
        useLocalStorage = !!checkbox.checked;
        libraryEle.disabled = useLocalStorage;
    });

    storeInLocalStorageButton.addEventListener('click', () => {
        const libraryText = libraryEle.value.split('\n');
        const cards = combineCardsByName(parseLibraryFile(libraryText));

        localStorage.setItem(localStorageKey, JSON.stringify(cards));
    });

    async function getImageUris(deck) {
        const withoutLands = deck.filter(c => !['Mountain', 'Forest', 'Island', 'Plains', 'Swamp'].includes(c.name));
        const dataForLocalizedGet = await Promise.all(withoutLands.map(card => getDataByName(card.amount, card.name)))
        const imageUris = await Promise.all(dataForLocalizedGet.map(card => getImageUrisForCard(card)));

        return imageUris.flat();
    }

    createProxiesButton.addEventListener('click', () => {
        const deckText = deckEle.value.split('\n');
        const deck = parseDeckFile(deckText);

        getImageUris(deck).then(imageUris => {
            imageUris.forEach(uri => {
                const img = document.createElement('img');
                img.setAttribute('src', uri);
                img.classList.add('card-image');

                proxyImages.appendChild(img);
            });
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const deckText = deckEle.value.split('\n');
        const libraryText = libraryEle.value.split('\n');

        const deck = parseDeckFile(deckText);

        let library;
        if (!useLocalStorage) {
            library = parseLibraryFile(libraryText);
        } else {
            library = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        }

        const missingCards = getMissingCards(combineCardsByName(deck), combineCardsByName(library));

        outputEle.value = missingCards.map(formatCard).join('\n');
    });

})
