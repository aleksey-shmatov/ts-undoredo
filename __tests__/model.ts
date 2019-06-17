import {
    observable,
    PropertyChangeEvent,
    ObservableCollection,
    NotifyPropertyChanged
} from 'ts-observable';

export class Point implements NotifyPropertyChanged {
    public propertyChanged = new PropertyChangeEvent();

    @observable
    public x: number;

    @observable
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Style implements NotifyPropertyChanged {
    public propertyChanged = new PropertyChangeEvent();

    @observable
    public color: number = 0;

    @observable
    public alpha: number = 1.0;

    @observable
    public thickness: number = 1;

    @observable
    public offset: Point = new Point();
}

export class Polyline implements NotifyPropertyChanged {
    public propertyChanged = new PropertyChangeEvent();

    @observable
    public style: Style = new Style();

    @observable
    public points: ObservableCollection<Point> = new ObservableCollection<Point>();
}