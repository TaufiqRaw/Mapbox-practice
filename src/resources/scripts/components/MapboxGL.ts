import mapbox, { LngLatLike } from "mapbox-gl";
import htm from 'htm';
import {h, render} from 'preact'
import {useState, useEffect, useRef} from 'preact/hooks'
import { selectedPointInterface } from "../types";

const html = htm.bind(h);

interface MapInterface{
    style?: string,
    containerStyle?: {
        height: number,
        width: number,
    }
    center?: LngLatLike,
    zoom?: number,
    flyTo?: LngLatLike,
    list : selectedPointInterface[]
}
const Map = ({style, containerStyle, center,zoom, flyTo, list}:MapInterface)=>{
    const mainContainer = useRef(<HTMLElement> document.createElement('div'));
    const mainMap = useRef<mapbox.Map|null>(null);
    const prevMarker = useRef<mapbox.Marker|null>(null);
    const allMarker = useRef<mapbox.Marker[]>([]);
    useEffect(()=>{
        const map = new mapbox.Map({
            accessToken : 'pk.eyJ1IjoidGF1ZmlxcmF3IiwiYSI6ImNsNGV2cXYxNTAwNW8zZG9hdGY3bDB2cW4ifQ.K9vy5CbQzVP_-K9N7RpIag',
            container : mainContainer.current,
            style: style ? style : "mapbox://styles/mapbox/streets-v11",
            center: center ? center : [107.612708, -6.899344],
            zoom: zoom ? zoom : 11,
        });
        mainMap.current = map;
    }, [])
    useEffect(()=>{
        allMarker.current.forEach(mark=>mark.remove());
        allMarker.current = [];
        list.forEach(mark=>{
            let x = new mapbox.Marker().setLngLat(mark.pos).setDraggable(false);
            allMarker.current.push(x);
            mainMap.current && x.addTo(mainMap.current);
        })
    }, [list])
    useEffect(()=>{
        if(!flyTo){
            if(prevMarker.current && allMarker.current.every(mark => mark.getLngLat() !== prevMarker.current?.getLngLat()))
                prevMarker.current.remove()
            prevMarker.current = null;
            return
        }
        if(prevMarker.current && allMarker.current.every(mark => mark.getLngLat() !== prevMarker.current?.getLngLat()))
            prevMarker.current.remove()
        let x = new mapbox.Marker().setLngLat(flyTo).setDraggable(false);
        prevMarker.current = x;
        mainMap.current && x.addTo(mainMap.current);
        mainMap.current?.flyTo({center: flyTo, zoom:14});
    }, [flyTo])
    return html`
        <div ref=${mainContainer} 
        style="
            ${containerStyle?.height ? `height:${containerStyle.height}` : ''}
            ${containerStyle?.width ? `width:${containerStyle.width}` : ''}
        " 
        class="
            ${containerStyle?.height ? '': `h-full`}
            ${containerStyle?.width ? '': `w-full`}
        ">
        </div>
    `
}

export default Map