import { Conectivity } from "../../../models/products/characteristics/conectivity";
import { HeadphoneType } from "../../../models/products/characteristics/headphone-type";
import { GeneralCharacteristics } from "./general-characteristics";

export interface HeadphoneCharacteristics extends GeneralCharacteristics{
    headphoneType: HeadphoneType;
    conectivity: Conectivity;
}
