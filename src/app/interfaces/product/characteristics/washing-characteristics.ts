import { WeightUnit } from "../../../models/products/characteristics/weight-unit"
import { GeneralCharacteristics } from "./general-characteristics"
import { WeightCapacity } from "./weight-capacity"

export interface WashingCharacteristics extends GeneralCharacteristics{
    weightCapacity:WeightCapacity
}
