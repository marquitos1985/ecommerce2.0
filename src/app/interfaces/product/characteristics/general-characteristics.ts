import { Color } from "../../../models/products/characteristics/color";
import { Country } from "../../../models/products/characteristics/country";
import { Dimension } from "./dimension";
import { Weight } from "./weight";

export interface GeneralCharacteristics {
    country: Country;
    color: Color;
    dimension: Dimension;
    weight: Weight;
}
