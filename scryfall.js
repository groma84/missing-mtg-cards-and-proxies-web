const apiUrl = 'https://api.scryfall.com/cards/';
const searchUrl = `${apiUrl}search`;

/**
 * Fetches the first found card's useful data we need to access the localized card info
 * @param name
 */
export function getDataByName(name) {
    // https://api.scryfall.com/cards/search?q=Battlefield%20Raptor&order=release
    return fetch(`${searchUrl}?order=release&q=${name}`)
        .then(res => res.json())
        .then(data => extractNecessaryData(data.data));
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
                    .then(data => getImageUris(data));
            } else {
                return getImageUris(data);
            }
        });
}

function extractNecessaryData(allDataObj) {
    return {cardNumber: allDataObj[0].collector_number, set: allDataObj[0].set};
}

function getImageUris(cardData) {
    if (cardData.card_faces?.length) {
        return cardData.card_faces.map(x => x.image_uris.png);
    }

    return [cardData.image_uris.png];
}
