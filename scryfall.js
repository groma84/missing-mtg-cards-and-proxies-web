const apiUrl = 'https://api.scryfall.com/cards/';
const searchUrl = `${apiUrl}search`;

/**
 * Fetches the first found card's useful data we need to access the localized card info
 */
export function getDataByName(amount, name) {
    // https://api.scryfall.com/cards/search?q=Battlefield%20Raptor&order=release
    return fetch(`${searchUrl}?order=release&unique=prints&q=${name}`)
        .then(res => res.json())
        .then(data => extractNecessaryData(amount, name, data.data));
}

/**
 * Gets the localized image uris if available
 * @param localizedGetData
 */
export function getImageUrisForCard(localizedGetData) {
    const amount = localizedGetData[0].amount; // always the same anyway

    const getUris = (idx, set, cardNumber) => {
        const startUri = `${apiUrl}${set}/${cardNumber}`;

        return fetch(`${startUri}/de`)
            .then(res => res.json())
            .then(data => {
                if (data.code === "not_found") {
                    if (idx < localizedGetData.length) {
                        const nextIndex = idx + 1;
                        return getUris(nextIndex, localizedGetData[idx].set, localizedGetData[idx].cardNumber);
                    } else {
                        // get the english card instead of the german one as final fallback
                        return fetch(`${startUri}/en`)
                            .then(res => res.json())
                            .then(data => getImageUris(amount, data));
                    }
                } else {
                    return getImageUris(amount, data);
                }
            });
    }

    return getUris(0, localizedGetData[0].set, localizedGetData[0].cardNumber)
}

function extractNecessaryData(amount, searchedName, allDataObj) {
    return allDataObj
        .filter(x => x.name === searchedName)
        .map(x => ({cardNumber: x.collector_number, set: x.set, amount}));
}

function getImageUris(amount, cardData) {
    const createArr = () => {
        if (cardData.card_faces?.length) {
            return cardData.card_faces.map(x => x.image_uris.png);
        }

        return [cardData.image_uris.png];
    }

    const arr = createArr();

    let results = [];
    for (let i = 0; i < amount; i++) {
        results = [...results, ...arr];
    }

    return results;
}
