const apiUrl = 'https://api.scryfall.com/cards/';
const searchUrl = `${apiUrl}search`;

/**
 * Fetches the first found card's useful data we need to access the localized card info
 * @param name
 */
export function getDataByName(amount, name) {
    // https://api.scryfall.com/cards/search?q=Battlefield%20Raptor&order=release
    return fetch(`${searchUrl}?order=release&q=${name}`)
        .then(res => res.json())
        .then(data => extractNecessaryData(amount, data.data));
}

export function getImageUrisForCard(localizedGetData) {
    // https://api.scryfall.com/cards/xln/96/de
    const url = `${apiUrl}${localizedGetData.set}/${localizedGetData.cardNumber}/de`;
    return fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.code === "not_found") {
                // get the english card instead of the german one
                return fetch(`${apiUrl}${localizedGetData.set}/${localizedGetData.cardNumber}`)
                    .then(res => res.json())
                    .then(data => getImageUris(localizedGetData.amount, data));
            } else {
                return getImageUris(localizedGetData.amount, data);
            }
        });
}

function extractNecessaryData(amount, allDataObj) {
    return {cardNumber: allDataObj[0].collector_number, set: allDataObj[0].set, amount};
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
