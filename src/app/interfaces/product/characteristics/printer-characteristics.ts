
import { PrinterType } from "../../../models/products/characteristics/printer-type";
import { GeneralCharacteristics } from "./general-characteristics";

export interface PrinterCharacteristics extends GeneralCharacteristics{
    printerType: PrinterType
    
}
