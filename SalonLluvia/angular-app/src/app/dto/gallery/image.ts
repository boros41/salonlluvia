import Hairstyle from "./hairstyle";
import HairColor from "./hair-color";

export default interface Image {
    id: number;
    url: string;
    description: string;
    hairstyles: Array<Hairstyle>;
    hairColors: Array<HairColor>;
}