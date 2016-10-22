const VELOCITY_FILTER_WEIGHT : number = 0.7;


class Point {
    constructor(public x: number, public y:number){}

    distanceFrom(p2: Point) {
        let dx = this.x - p2.x;
        let dy = this.y - p2.y;

        return Math.sqrt( dx*dx + dy*dy ); 
    };
    velocityFrom(last: Point, endTime: number, startTime: number, lastVel: number) {
        let v = this.distanceFrom(last) / (endTime - startTime);

        v = VELOCITY_FILTER_WEIGHT * v + (1 - VELOCITY_FILTER_WEIGHT) * lastVel;
        return Math.abs( v );
    };

    public toString = () : string => {
        return `x: ${this.x}, y: ${this.y}`;
    };
};

export {
    Point
};