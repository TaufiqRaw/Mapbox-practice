import htm from 'htm';
import {h, render} from 'preact'
import {useState, useEffect} from 'preact/hooks'
import 'mapbox-gl/dist/mapbox-gl.css';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';
import { GeocodeFeature } from '@mapbox/mapbox-sdk/services/geocoding';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import {selectedPointInterface} from '../types'
import { LngLatLike } from 'mapbox-gl';

const html = htm.bind(h);

interface mapOverlayParam{
    setSelected : (selectedItem:selectedPointInterface|null)=>void,
    selected : selectedPointInterface | null | undefined,
    handleSave : (selectedItem:selectedPointInterface)=>void,
    list : selectedPointInterface[],
    handleDelete: (id:number)=>void,
}
const MapOverlay = ({setSelected, selected, handleSave, list, handleDelete}:mapOverlayParam)=>{
    const [listOpen, setListOpen] = useState(true);
    const [searchOpen, setSearchOpen] = useState(false);
    const [addressVal, setAddressVal] = useState("");
    const [searchLoading, setSearchLoading] = useState(0);
    const [searchData, setSearchData] = useState<GeocodeFeature[]>([]);

    const searchLoadingWrapper = <F extends (...args: any[]) => Promise<any>>(func:F)=>{
        setSearchLoading(1);
        func()
            .then((data)=>{
                setSearchLoading(0)
            })
            .catch((err)=>{
                setSearchLoading(1)
            })
    }
    const handleSearch = (e:KeyboardEvent)=>async()=>{
        const {data} = await axios.get(`/api/map?q=${addressVal}`);
        setSearchData(data);
    };
    return html`
        <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
            <div class="relative w-full h-full">
                ${selected && html`
                    <div class="absolute top-8 left-7 w-[25rem] h-40 bg-white pointer-events-auto rounded-md" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
                        <div className="w-full h-full box-border p-4 relative">
                            <i class="bx bx-collapse-alt text-3xl absolute top-2 right-2 cursor-pointer" onclick="${()=>setSelected(null)}"></i>
                            <div class="text-gray-700">
                                ${selected.name}
                            </div>
                            <div>
                                ${selected.address}
                            </div>
                            ${selected.id? html`
                                <button class="absolute right-0 bottom-0 rounded-b-md w-full px-3 py-2 bg-red-500 text-white" onclick=${()=>{setAddressVal("");setSelected(null); setSearchOpen(false);selected.id && handleDelete(selected.id)}}>Delete This Address</button>
                            `: html`
                                <button class="absolute right-0 bottom-0 rounded-b-md w-full px-3 py-2 bg-blue-500 text-white" onclick=${()=>{setAddressVal("");setSelected(null); setSearchOpen(false);handleSave(selected)}}>Save This Address</button>
                            `}
                        </div>
                    </div>
                `}
                <i class='bx ${listOpen? "bx-collapse-alt": "bx-expand-alt"} absolute top-3 right-3 text-4xl hover:text-blue-500 cursor-pointer z-10 pointer-events-auto' onclick="${()=>{setListOpen(!listOpen)}}"></i>
                <div class="pointer-events-auto w-1/4 h-full absolute right-0 bg-white duration-300 ease-out transition-transform ${listOpen? "": "translate-x-full"}" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
                    <div class="flex flex-col items-center ${list.length>0 ? "" :"justify-center"} w-full h-full px-6 box-border text-center">
                        ${list.length > 0 ? html`
                            <div class="w-full box-border px-4 py-3">
                                <div class="py-3 border-b border-gray-400">
                                    Saved Address
                                </div>
                                ${list.map(place=>html`
                                    <div key=${place.id} class="py-4 border-b border-gray-400 hover:bg-blue-100 cursor-pointer" onclick=${()=>{setListOpen(false);setSelected({name:place.name, address:place.address, pos: <LngLatLike> place.pos, id:place.id})}}>
                                        <div class="text-gray-700">
                                            ${place.name}
                                        </div>
                                        <div>
                                            ${place.address}
                                        </div>
                                    </div>
                                `)}
                            </div>
                        `: html`
                            <i class='bx bx-edit text-4xl'></i>
                            <div class="text-3xl pb-7">No Entry Found!</div>
                            <div>Enter new location by typing the address in the search bar! <br/>(open search bar by clicking <i class="bx bx-search-alt-2"></i> button on bottom left corner)</div>
                        `}
                    </div>
                </div>
                <div class="pointer-events-auto absolute bottom-7 left-6">
                    <div class="relative">
                        <div class="w-14 h-14 flex items-center justify-center relative bg-white rounded-full z-[1]" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;" onclick="${()=>{setSearchOpen(!searchOpen)}}">
                            <i class="bx bx-search-alt-2 text-4xl text-blue-500 transform transition-transform ${searchOpen? "rotate-90": ''}"></i>
                        </div>
                        <div class="absolute top-0 left-0 bg-white rounded-full w-[26rem] h-full z-[0] flex justify-center overflow-hidden transition-all duration-300 ease-out ${searchOpen? '': 'w-0 opacity-0'}" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
                            <input type="text" class="ml-12 w-[calc(90%-3rem)] border-none outline-none" placeholder="Type Address here" value="${addressVal}" oninput="${(e:any)=>{setAddressVal(e?.target.value)}}"
                            onkeydown="${(e:KeyboardEvent)=>{if (e.key !== 'Enter' || searchLoading === 1) return;searchLoadingWrapper(handleSearch(e))}}"
                            />
                        </div>
                    </div>
                </div>
                ${searchOpen && addressVal && html`
                    <div class="pointer-events-auto absolute bottom-24 left-8 rounded-md w-[25rem] h-64 bg-white" style="box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;">
                        ${searchLoading === 0 ? 
                            searchData.length > 0 ? 
                            html`
                            <${SimpleBar} style=${{ maxHeight: 256 }} autoHide=${false}>
                                <div class="w-[25rem] box-border px-4 py-3">
                                    ${searchData.map(place=>html`
                                        <div class="py-4 border-b border-gray-400 hover:bg-blue-100 cursor-pointer" onclick=${()=>{setListOpen(false);setSelected({name:place.text, address:place.place_name, pos: <LngLatLike> place.center})}}>
                                            <div class="text-gray-700">
                                                ${place.text}
                                            </div>
                                            <div>
                                                ${place.place_name}
                                            </div>
                                        </div>
                                    `)}
                                </div>
                            </${SimpleBar}>
                            `:
                            html`
                                <div class="w-full h-full flex flex-col items-center justify-center text-center gap-y-3">
                                    <span class="font-medium">Press enter to search</span>
                                    <span>For better search results, use address instead of specific name</span>
                                </div>
                            `
                        : searchLoading === 1 && html`
                            <div class="w-full h-full flex items-center justify-center">
                                <${LoadingSpinner}/>
                            </div>
                        `}
                    </div>
                `}
            </div>
        </div>
    `
}

export default MapOverlay