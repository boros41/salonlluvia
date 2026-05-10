import HairColor from "./hair-color";
import Hairstyle from "./hairstyle";

export default interface ImageFilters {
    hairstyles: Array<Hairstyle>,
    hairColors: Array<HairColor>
}