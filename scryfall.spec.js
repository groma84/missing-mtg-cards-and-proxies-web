// WARNING: These tests need a working Internet connection and access the scryfall API!

import {describe, it, expect} from 'vitest';
import {getDataByName} from "./scryfall";

const basicCreature = 'Battlefield Raptor';
const doubleFacedCard = 'Barkchannel Pathway';
