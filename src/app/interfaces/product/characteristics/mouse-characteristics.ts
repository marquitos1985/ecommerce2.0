import { Conectivity } from "../../../models/products/characteristics/conectivity";
import { GeneralCharacteristics } from "./general-characteristics";

export interface MouseCharacteristics extends GeneralCharacteristics {
    conectivity: Conectivity
}
