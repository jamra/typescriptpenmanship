import {Signature} from './ts/signature';

var canvas: HTMLCanvasElement;
let sign : Signature;

window.onload = () => {
   canvas = <HTMLCanvasElement>document.getElementById('canvas');
   sign = new Signature( canvas );
  };

let genImage = () => {
    var dataURL = canvas.toDataURL();

    // var img : HTMLImageElement = <HTMLImageElement>document.getElementById("snapshot");
    // img.style.border = "2px solid";
    // img.src = dataURL;
    // img.setAttribute("style", "display: none;");
};

window['genImage'] = genImage;