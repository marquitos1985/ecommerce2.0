import { VolumeUnit } from "../../../models/products/characteristics/volume-unit"
import { GeneralCharacteristics } from "./general-characteristics"
import { VolumeCapacity } from "./volume-capacity"

export interface MicrowaveCharacteristics extends GeneralCharacteristics{
    capacity: VolumeCapacity;
}
