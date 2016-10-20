import {Point} from './ts/point';

var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

let isDown = false;
let prev : Point;
let curr : Point;

window.onload = () => {
   canvas = <HTMLCanvasElement>document.getElementById('canvas');
   ctx = canvas.getContext("2d");

   ctx.fillStyle = "#EEE";
   ctx.fillRect(0, 0, 1280, 720);

   canvas.addEventListener("mousemove", (e : MouseEvent) => {
        if (isDown) {
            prev = curr;
            curr = new Point(
                e.clientX - canvas.offsetLeft,
                e.clientY - canvas.offsetTop,
                e.timeStamp,
                0
            );
            
            let vel = curr.velocityFrom( prev );
            console.log(vel);
            let strokeWidth = Math.abs( vel );

            draw(strokeWidth);
        }
   }, false);

   canvas.addEventListener("mousedown", (e : MouseEvent) => {
       prev = curr;
       curr = new Point(
           e.clientX - canvas.offsetLeft, 
           e.clientY - canvas.offsetTop,
           e.timeStamp,
           0
       );

       isDown = true;
    }, false);

   let leave = (e : MouseEvent) => {
       isDown = false;
   };
   canvas.addEventListener("mouseup", leave, false);
   canvas.addEventListener("mouseout", leave, false);
};

let draw = (stroke) => {
    //TODO: Use cubic bezier for smoothe curves
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = stroke;
        ctx.stroke();
        ctx.closePath();
};

let genImage = () => {
    var dataURL = canvas.toDataURL();

    var img : HTMLImageElement = <HTMLImageElement>document.getElementById("snapshot");
    img.style.border = "2px solid";
    img.src = dataURL;
    img.setAttribute("style", "display: none;");
};

window['genImage'] = genImage;