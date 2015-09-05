/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import {observable, INotifyPropertyChanged, PropertyChangeEvent, ObservableCollection} from 'ts-observable';

export class Point implements INotifyPropertyChanged{
	public propertyChanged:PropertyChangeEvent = new PropertyChangeEvent();
		
	@observable
	public x:number;
	
	@observable
	public y:number;
	
	constructor(x: number = 0, y: number = 0){
		this.x = x;
		this.y = y;
	}
}

export class Style implements INotifyPropertyChanged{
	public propertyChanged:PropertyChangeEvent = new PropertyChangeEvent();	
		
	@observable
	public color:number;
	
	@observable
	public alpha:number;
	
	@observable
	public thickness:number;
	
	@observable
	public offset:Point;
	
	constructor(){
		this.color = 0;
		this.alpha = 1.0;
	}
}

export class Polyline implements INotifyPropertyChanged{
	public propertyChanged:PropertyChangeEvent = new PropertyChangeEvent();
	
	@observable
	public style:Style;
	
	@observable
	public points:ObservableCollection<Point> = new ObservableCollection<Point>();
	
}