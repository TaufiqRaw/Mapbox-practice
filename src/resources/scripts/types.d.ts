import { LngLatLike } from "mapbox-gl";

export interface selectedPointInterface{
    id?: number,
    name : string,
    address : string,
    pos : LngLatLike
}
