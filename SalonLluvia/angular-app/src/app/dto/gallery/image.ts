import HairstyleResponse from "./hairstyle";
import HairColorResponse from "./hair-color";

export default interface Image {
    id: number;
    url: string;
    description: string;
    hairstyles: Array<HairstyleResponse>;
    hairColors: Array<HairColorResponse>;
}