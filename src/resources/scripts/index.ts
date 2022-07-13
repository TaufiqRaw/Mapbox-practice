import htm from 'htm';
import {h, render} from 'preact'
import {useState, useEffect} from 'preact/hooks'
import 'boxicons/css/boxicons.min.css';
import '../styles/style.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import Map from './components/MapboxGL'
import MapOverlay from './components/MapboxOverlay';
import { debounce } from './util/debounce';
import {selectedPointInterface} from './types';
import axios from 'axios';
import QueryString from 'qs';

const html = htm.bind(h);

const Main = ()=>{
    const [screenHeight, setScreenHeight] = useState(window.innerHeight);
    const [selected, setSelected] = useState<selectedPointInterface|null>(null);
    const [list, setList] = useState<selectedPointInterface[]>([]);

    const setScreenHandler = debounce(()=>{setScreenHeight(window.innerHeight); console.log('momento')},25);
    useEffect(()=>{
        window.addEventListener('scroll', setScreenHandler)
        window.addEventListener('resize', setScreenHandler)
        return ()=>{
            window.removeEventListener('scroll', setScreenHandler)
            window.removeEventListener('resize', setScreenHandler)
        }
    })

    useEffect(()=>{
        axios.get('/api/markers/')
            .then(({data})=>{
                const newList:selectedPointInterface[] = data.map((el:any)=>{
                    return {
                        id: el.id,
                        name: el.name,
                        pos : [el.longitude, el.latitude],
                        address : el.address
                    }
                })              
                setList(newList);
            })
    },[]);

    async function handleSave(item:selectedPointInterface){
        const markerPos = <Array<number>> item.pos;
        const marker = {
            name : item.name,
            address : item.address,
            longitude : markerPos[0],
            latitude : markerPos[1]
        }
        const {data} = await axios.post('/api/markers/', QueryString.stringify({marker}));
        
        setList([...list, {...item, id : data.id}]);
    }

    async function handleDelete(id:number){
        await axios.delete(`/api/markers/${id}`);
        setList(list.filter(mark=>mark.id !== id));
    }

    return html`
        <div class="w-screen bg-green-500 overflow-hidden relative" style="${"height:"+screenHeight+"px;"}">
            <${Map} flyTo=${selected?selected.pos: null} list=${list}/>
            <${MapOverlay} selected=${selected} list=${list} handleDelete=${handleDelete} handleSave=${handleSave} setSelected=${(selectedItem:selectedPointInterface|null)=>{setSelected(selectedItem)}}/>
        </div>
    `
}

render(html`<${Main}/>`, <Element>document.getElementById("root"))
