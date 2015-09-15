import {observable, ObservableObject, PropertyChangeEvent, ObservableCollection} from 'ts-observable';

export class Point extends ObservableObject{
		
	@observable
	public x:number;
	
	@observable
	public y:number;
	
	constructor(x: number = 0, y: number = 0){
		super();
		this.x = x;
		this.y = y;
	}
}

export class Style extends ObservableObject{
	@observable
	public color:number;
	
	@observable
	public alpha:number;
	
	@observable
	public thickness:number;
	
	@observable
	public offset:Point;
	
	constructor(){
		super();
		this.color = 0;
		this.alpha = 1.0;
	}
}

export class Polyline extends ObservableObject{
	@observable
	public style:Style;
	
	@observable
	public points:ObservableCollection<Point> = new ObservableCollection<Point>();
	
	constructor(){
		super();
	}
}