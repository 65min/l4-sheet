import './style.css'

import initToolbar from './core/toolbar.ts';
import Wrap from './core';

// document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://www.typescriptlang.org/" target="_blank">
//       <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
//     </a>
//     <h1>Vite + TypeScript</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite and TypeScript logos to learn more
//     </p>
//   </div>
// `

document.querySelector('#app')!.innerHTML = `
<div class="l4">
<!--    <div class="l4__toolbar-wrap"></div>-->
<!--    <div class="l4__content-wrap"></div>-->
</div>
`

new Wrap('.l4').init();

// setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)
