import { ScreenTechnology } from "../../../models/products/characteristics/screen-technology";
import { Smart } from "../../../models/products/characteristics/smart";
import { GeneralCharacteristics } from "./general-characteristics";
import { ScreenSize } from "./screen-size";

export interface TvCharacteristics extends GeneralCharacteristics{
    screenTechnology: ScreenTechnology,
    screenSize: ScreenSize;
    smart: Smart;
                    

}
