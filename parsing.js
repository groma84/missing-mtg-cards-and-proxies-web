/**
 * Parses a MTGO format line into a card object
 * Example data: 2 Chaplain of Alms / Chapel Shieldgeist
 * @param line
 */
export function parseOneMtgoLine(line) {
    const withOnlySingleWhitespaces = line.replace(/\s+/g, ' ')
    const split = withOnlySingleWhitespaces.split(' ');

    // we need exactly the amount and the name
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

    if (split.length < 14) {
        return undefined;
    }

    const [_, amount] = split;
    const name = split.slice(3, split.length - 11).join(',').replaceAll('"', '').trim();

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
        .slice(2)
        .filter(s => !!s)
        .map(parseOneDragonShieldLine)
        .filter(co => !!co);
}
