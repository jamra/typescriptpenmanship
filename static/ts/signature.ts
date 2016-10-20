import { Point } from './point';

class Signature {
    points: Array<Point> = new Array<Point>();
    _isDrawing: boolean = false;
    ctx: CanvasRenderingContext2D;

    constructor(public canvas: HTMLCanvasElement, {bgColor="#EEE"} = {}) {
        this.ctx = canvas.getContext("2d");

        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        canvas.addEventListener("mousemove", (e : MouseEvent) => this.move( e.clientX, e.clientY, e.timeStamp ), false);
        canvas.addEventListener("touchmove", (e : TouchEvent) => {
            let touch : Touch = e.touches.item(0);
            this.move( touch.clientX, touch.clientY, e.timeStamp );
        }, false);


        canvas.addEventListener("mousedown", (e : MouseEvent) => this.start( e.clientX, e.clientY, e.timeStamp ), false); 
        canvas.addEventListener("touchdown", (e : TouchEvent) => {
            let touch : Touch = e.touches.item(0);
            this.move( touch.clientX, touch.clientY, e.timeStamp );
        }, false);


        let leave = (e : MouseEvent) => this.stop();
        canvas.addEventListener("mouseup", leave, false);
        canvas.addEventListener("mouseout", leave, false);
        canvas.addEventListener("touchend", leave, false);
    }

    start(x: number, y: number, timeStamp: number) {
        let curr = new Point(
            x - this.canvas.offsetLeft,
            y - this.canvas.offsetTop,
            timeStamp,
            0
        );

        this.points.push(curr);
        this._isDrawing = true;
    }

    stop() {
        this._isDrawing = false;
        this.points = new Array<Point>();
    }

    move(x: number, y: number, timeStamp: number) {
        if (this._isDrawing) {
            let curr = new Point(
                x - this.canvas.offsetLeft,
                y - this.canvas.offsetTop,
                timeStamp,
                0
            );

            this.points.push(curr);

            if (this.points.length > 2) {
                //Optimization borrowed from https://github.com/szimek/signature_pad/blob/master/signature_pad.js
                if (this.points.length === 3)  {
                    this.points.unshift(this.getFirst());
                }

                let vel = Math.abs( curr.velocityFrom(this.getPrev()) );
                let strokeWidth =  Math.max( 5.0 / (vel + 1), 2 );

                this.draw( strokeWidth );

                this.points.shift();
            }
        }
    }

    draw(strokeWidth: number) {
        //TODO: Use cubic bezier for smoothe curves
        let ctx = this.ctx;
        let points = this.points;

        ctx.beginPath();
        ctx.moveTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.strokeStyle = "#333";
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.closePath();
    }

    getCurr = () => this.points[this.points.length - 1];
    getPrev = () => this.points[this.points.length - 2];
    getFirst = () => this.points[0];
   
    getImageUrl() {
        return this.canvas.toDataURL();
    }
};

export {
    Signature
};