import { Point } from './point';
import { Bezier } from './bezier';

class Signature {
    points: Array<Point> = new Array<Point>();
    _isDrawing: boolean = false;
    ctx: CanvasRenderingContext2D;

    _lastWidth: number;
    _lastVelocity: number;
    _lastTimeStamp: number;

    constructor(public canvas: HTMLCanvasElement, {bgColor = "#EEE", strokeColor = "#333"} = {}) {
        this.ctx = canvas.getContext("2d");

        this.ctx.fillStyle = bgColor;
        this.ctx.strokeStyle = strokeColor;
        this.ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

        canvas.addEventListener("mousemove", (e: MouseEvent) => this.move(e.clientX, e.clientY, e.timeStamp), false);
        canvas.addEventListener("touchmove", (e: TouchEvent) => {
            let touch: Touch = e.changedTouches[0];
            e.preventDefault();
            this.move(touch.clientX, touch.clientY, e.timeStamp);
        }, false);

        canvas.addEventListener("mousedown", (e: MouseEvent) => this.start(e.clientX, e.clientY, e.timeStamp), false);
        canvas.addEventListener("touchstart", (e: TouchEvent) => {
            let touch: Touch = e.changedTouches[0];
            e.preventDefault();
            this.start(touch.clientX, touch.clientY, e.timeStamp);
        }, false);

        let leave = (e: MouseEvent) => this.stop();
        canvas.addEventListener("mouseup", leave, false);
        canvas.addEventListener("mouseout", leave, false);
        canvas.addEventListener("touchend", leave, false);
    }

    start(x: number, y: number, timeStamp: number) {
        let curr = new Point(
            x - this.canvas.offsetLeft,
            y - this.canvas.offsetTop,
        );

        this.points.push(curr);
        this._isDrawing = true;
        this._lastTimeStamp = timeStamp;
        this._lastVelocity = 0;
    }

    stop() {
        this._isDrawing = false;
        this.points = new Array<Point>();
    }

    move(x: number, y: number, timeStamp: number) {
        if (this._isDrawing) {
            let curr = new Point(
                x - this.canvas.offsetLeft,
                y - this.canvas.offsetTop
            );

            this.points.push(curr);

            if (this.points.length > 2) {
                //Optimization borrowed from https://github.com/szimek/signature_pad/blob/master/signature_pad.js
                if (this.points.length === 3) {
                    this.points.unshift(this.points[0]);
                }

                let first = Bezier.CalculateControlPoints(this.points[0], this.points[1], this.points[2]);
                let second = Bezier.CalculateControlPoints(this.points[1], this.points[2], this.points[3]);

                let bezier = new Bezier(this.points[0], first.c2, second.c1, this.points[2]);

                let vel = curr.velocityFrom(bezier.p1, timeStamp, this._lastTimeStamp, this._lastVelocity);
                let strokeWidth = Math.max(4.0 / (vel + 1), 1.0);

                this.draw(strokeWidth, bezier);

                this._lastWidth = strokeWidth;
                this._lastVelocity = vel;
                this._lastTimeStamp = timeStamp;

                this.points.shift();
            }
        }
    }

    draw(strokeWidth: number, bezier: Bezier) {
        let ctx = this.ctx;
        let points = this.points;

        let widthDelta = Math.max( Math.sqrt(strokeWidth - this._lastWidth), 0 );

        let width, i, t, tt, ttt, u, uu, uuu, x, y;
        let drawSteps = Math.floor(bezier.length());

        ctx.beginPath();

        for (let i = 0; i < drawSteps; i++) {
            t = i / drawSteps;
            tt = t * t;
            ttt = tt * t;
            u = 1 - t;
            uu = u * u;
            uuu = uu * u;

            x = uuu * bezier.p1.x;
            x += 3 * uu * t * bezier.c1.x;
            x += 3 * u * tt * bezier.c2.x;
            x += ttt * bezier.p2.x;

            y = uuu * bezier.p1.y;
            y += 3 * uu * t * bezier.c1.y;
            y += 3 * u * tt * bezier.c2.y;
            y += ttt * bezier.p2.y;

            width = this._lastWidth + ttt * widthDelta;

            this.drawPoint(x, y, width);
        }

        // ctx.moveTo(points[2].x, points[2].y);
        // ctx.lineTo(points[3].x, points[3].y);
        // ctx.lineWidth = strokeWidth;
        // ctx.stroke();


        ctx.closePath();
    }

    drawPoint(x: number, y: number, size: number) {
        //this.ctx.lineWidth = size;
        this.ctx.strokeStyle = "#222";
        this.ctx.moveTo(x, y);
        this.ctx.arc(x, y, size, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }

    getCurr = () => this.points[this.points.length - 1];
    getPrev = () => this.points[this.points.length - 2];
    getFirst = () => this.points[0];
    getImageUrl = () => this.canvas.toDataURL();

};

export {
    Signature
};