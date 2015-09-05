/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import { INotifyPropertyChanged, PropertyChangeEvent, ObservableCollection } from 'ts-observable';
export declare class Point implements INotifyPropertyChanged {
    propertyChanged: PropertyChangeEvent;
    x: number;
    y: number;
    constructor(x?: number, y?: number);
}
export declare class Style implements INotifyPropertyChanged {
    propertyChanged: PropertyChangeEvent;
    color: number;
    alpha: number;
    thickness: number;
    offset: Point;
    constructor();
}
export declare class Polyline implements INotifyPropertyChanged {
    propertyChanged: PropertyChangeEvent;
    style: Style;
    points: ObservableCollection<Point>;
}
