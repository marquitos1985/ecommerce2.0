import { Conectivity } from "../../../models/products/characteristics/conectivity";
import { GeneralCharacteristics } from "./general-characteristics";

export interface KeyboardCharacteristics extends GeneralCharacteristics{
    conectivity: Conectivity
}
