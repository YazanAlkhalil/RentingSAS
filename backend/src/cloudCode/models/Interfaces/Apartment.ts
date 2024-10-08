export interface Apartment {
    _id: string;
    number: string;
    floor: number;
    size: string;
    bedroom: number;
    bathroom: number;
    amenities: string[];
    isFurnished: boolean;
    status: string;
    description: string;
    img: Parse.File[];
    rentPrice: string;
  }