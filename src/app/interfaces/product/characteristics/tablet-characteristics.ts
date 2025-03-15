import { GeneralCharacteristics } from "./general-characteristics";
import { MemorySize } from "./memory-size";
import { ScreenSize } from "./screen-size";

export interface TabletCharacteristics extends GeneralCharacteristics{
    screenSize: ScreenSize;
    ram: MemorySize;
    storageSize: MemorySize;
}
