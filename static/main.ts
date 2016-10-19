var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;

let  prevX = 0,
     currX = 0,
     prevY = 0,
     currY = 0,
     flag = false;

window.onload = () => {
   canvas = <HTMLCanvasElement>document.getElementById('canvas');
   ctx = canvas.getContext("2d");

   ctx.fillStyle = "#EEE";
   ctx.fillRect(0, 0, 1280, 720);

   canvas.addEventListener("mousemove", function (e) {
        findxy('move', e)
    }, false);
    canvas.addEventListener("mousedown", function (e) {
        findxy('down', e)
    }, false);
    canvas.addEventListener("mouseup", function (e) {
        findxy('up', e)
    }, false);
    canvas.addEventListener("mouseout", function (e) {
        findxy('out', e)
    }, false);
}
let findxy = (res, e : MouseEvent) => {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
    
            flag = true;
        }
        
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                //TODO: Add acceleration
                //Perhaps use e.timestamp to measure the change between the delta of the timestamps
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw(2);
            }
        }
    };

let draw = (stroke) => {
    //TODO: investigate changing lineTo into arcTo/bezierTo in the case that I want less choppy lines
    //alternative: use the 2nd previous position to position the arc/bezier
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = stroke;
        ctx.stroke();
        ctx.closePath();
};

let genImage = () => {
    var dataURL = canvas.toDataURL();

    var img  = document.getElementById("snapshot");
    img.style.border = "2px solid";
    img["src"] = dataURL;
    img.setAttribute("style", "display: none;");

    console.log(dataURL);
};

window['genImage'] = genImage;