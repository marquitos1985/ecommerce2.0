import { CoolingSystem } from "../../../models/products/characteristics/cooling-system";
import { GeneralCharacteristics } from "./general-characteristics";

export interface RefrigeratorCharacteristics extends GeneralCharacteristics {
    coolingSystem: CoolingSystem
}
