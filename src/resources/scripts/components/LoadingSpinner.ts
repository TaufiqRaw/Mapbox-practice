import htm from 'htm';
import {h} from 'preact'
import {useState, useEffect} from 'preact/hooks'

const html = htm.bind(h);

const LoadingSpinner = ()=>{
    return html`
        <div class="lds-ring"><div></div><div></div><div></div><div></div></div>
    `
}
export default LoadingSpinner