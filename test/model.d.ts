import { ObservableObject, ObservableCollection } from 'ts-observable';
export declare class Point extends ObservableObject {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
}
export declare class Style extends ObservableObject {
    color: number;
    alpha: number;
    thickness: number;
    offset: Point;
    constructor();
}
export declare class Polyline extends ObservableObject {
    style: Style;
    points: ObservableCollection<Point>;
    constructor();
}
