/**
 * Parses a MTGO format line into a card object
 * Example data: 2 Chaplain of Alms / Chapel Shieldgeist
 * @param line
 */
export function parseOneMtgoLine(line) {
    const split = line.split(' ');

    // we need exactle the amount and the name
    if (split.length < 2) {
        return undefined;
    }

    const [amount] = split;


    const name = split.slice(1).join(' ');

    const splitCardsWithMultipleNames = name.split('/');

    const [firstPart] = splitCardsWithMultipleNames;


    return {amount: parseInt(amount), name: firstPart.trim()};
}

/**
 * Parses one Dragon Shield Card Scanner line into a card object
 * Example line: 1, Blacksmith's Skill, MH2, NearMint, 0.02, Normal, German, 2021-11-28
 * @param line
 */
export function parseOneDragonShieldLine(line) {
    const split = line.split(',');

    // we have at least the amount, one for the name, and 6 info columns
    if (split.length < 8) {
        return undefined;
    }

    const [amount] = split;
    const name = split.slice(1, split.length - 6).join(',').trim();

    return {amount: parseInt(amount), name};
}

/**
 * Parses each line of a MTGO file into the corresponding card object
 * @param lines
 */
export function parseDeckFile(lines) {
    return lines
        .filter(s => !!s)
        .map(parseOneMtgoLine)
        .filter(co => !!co);
}

/**
 * Parse the contents of the library file (Dragon Shield Card Scanner format)
 * @param lines
 */
export function parseLibraryFile(lines) {
    return lines
        .filter(s => !!s)
        .map(parseOneDragonShieldLine)
        .filter(co => !!co);
}
