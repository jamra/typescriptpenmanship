
const VELOCITY_FILTER_WEIGHT : number = 0.7;


class Point {
    constructor(public x: number, public y:number, public timeStamp?:number, public v?:number){}

    distanceFrom(p2: Point) {
        return Math.sqrt( (this.x - p2.x) * (this.x - p2.x) + (this.y - p2.y) * (this.y - p2.y) ); 
    }
    velocityFrom(last: Point) {
        this.v = this.distanceFrom(last) / (this.timeStamp - last.timeStamp);

        this.v = VELOCITY_FILTER_WEIGHT * this.v + (1 - VELOCITY_FILTER_WEIGHT) * last.v;
        return this.v;
    };
};

export {
    Point
};