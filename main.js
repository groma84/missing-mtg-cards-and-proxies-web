import './style.css'
import {parseDeckFile, parseLibraryFile} from "./parsing";
import {combineCardsByName, getMissingCards} from "./diffing";

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
