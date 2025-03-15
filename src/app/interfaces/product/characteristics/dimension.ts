import { LengthUnit } from "../../../models/products/characteristics/length-unit";

import { Depth } from "./depth";
import { Height } from "./height";
import { Width } from "./width";

export interface Dimension {
    height: Height;
    width: Width;
    depth: Depth;
}
