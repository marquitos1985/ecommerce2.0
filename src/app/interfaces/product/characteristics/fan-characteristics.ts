import { FanType } from "../../../models/products/characteristics/fan-type";
import { GeneralCharacteristics } from "./general-characteristics";

export interface FanCharacteristics extends GeneralCharacteristics{
    fanType: FanType
}
