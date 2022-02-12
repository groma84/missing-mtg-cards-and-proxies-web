/**
 * Some cards exist multiple times in the data - we need to add their amounts
 * @param cards
 */
export function combineCardsByName(cards) {
    const summed = new Map();

    cards.forEach(card => {
        if(summed.has(card.name)) {
            const {amount} = summed.get(card.name);
            summed.set(card.name, {...card, amount: amount + card.amount});
        } else {
            summed.set(card.name, card);
        }
    });

    return [...summed.values()];
}

/**
 * Find out which and how many cards wanted for the deck are missing from the library
 * @param cardsForDeck
 * @param cardsFromLibrary
 */
export function getMissingCards(cardsForDeck, cardsFromLibrary) {
    const libMap = new Map(cardsFromLibrary.map(card => [card.name, card]));

    return cardsForDeck.reduce((missingCards, wantedCard) => {
        if (libMap.has(wantedCard.name)) {
            const ownedCard = libMap.get(wantedCard.name);
            const missingAmount = Math.max(0, wantedCard.amount - ownedCard.amount);

            if (missingAmount > 0) {
                missingCards.push({...wantedCard, amount: missingAmount});
            }
        } else {
            missingCards.push(wantedCard);
        }

        return missingCards;
    }, []);
}
