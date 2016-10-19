var canvas: HTMLCanvasElement;
var ctx: CanvasRenderingContext2D;
let  prevX = 0,
     currX = 0,
     prevY = 0,
     currY = 0,
     flag = false;

window.onload = () => {
   canvas = <HTMLCanvasElement>document.getElementById('cnvs');
   ctx = canvas.getContext("2d");

   ctx.fillStyle = "black";
   ctx.fillRect(0, 0, 1280, 720);

//     ctx.beginPath();
//    ctx.strokeStyle = "red";
//    ctx.lineWidth = 2;

//    ctx.arc(200, 200, 100, 0, 2 * Math.PI);
//    ctx.stroke();


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
let findxy = (res, e) => {
        if (res == 'down') {
            prevX = currX;
            prevY = currY;
            currX = e.clientX - canvas.offsetLeft;
            currY = e.clientY - canvas.offsetTop;
    
            flag = true;
            // dot_flag = true;
            // if (dot_flag) {
            //     ctx.beginPath();
            //     ctx.fillStyle = x;
            //     ctx.fillRect(currX, currY, 2, 2);
            //     ctx.closePath();
            //     dot_flag = false;
            // }
        }
        if (res == 'up' || res == "out") {
            flag = false;
        }
        if (res == 'move') {
            if (flag) {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                draw();
            }
        }
    };

let draw = () => {
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(currX, currY);
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();
    };


    let genImage = () => {

         document.getElementById("canvasimg").style.border = "2px solid";
        var dataURL = canvas.toDataURL();
        document.getElementById("canvasimg").src = dataURL;
        document.getElementById("canvasimg").style.display = "inline";
    };