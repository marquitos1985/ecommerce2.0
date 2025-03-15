import { LengthUnit } from "../../../models/products/characteristics/length-unit";
import { MemoryUnit } from "../../../models/products/characteristics/memory-unit";
import { GeneralCharacteristics } from "./general-characteristics";
import { MemorySize } from "./memory-size";
import { ScreenSize } from "./screen-size";

export interface SmartphoneCharacteristics extends GeneralCharacteristics{
    screenSize: ScreenSize;
    ram: MemorySize;
}
