import {ObservableCollection} from 'ts-observable';

export interface IUndoRedoCommand{
	getTimestamp():number;
	getDuration():number;
	label:string;
    undo():void;
	redo():void;
}

export class CommandBase implements IUndoRedoCommand{
	
	private _timestamp:number;
	private _label:string;
	
	constructor(){
		this._timestamp = new Date().getTime();
	}
	
	public getTimestamp():number{
		return this._timestamp;
	}
	
	public getDuration():number{
		return 0;
	}
	
	public get label():string{
		return this._label;
	}
	
	public set label(value:string){
		this._label = value;
	}
	
	public undo():void{
		throw new Error("Not implemented");
	}
	
	public redo():void{
		throw new Error("Not implemented");
	}
}

export class PropertyChangeCommand extends CommandBase{
	private _propertyName:string;
	private _oldValue:any;
	private _newValue:any;
	private _target:any;
	
	constructor(target:any, propertyName:string, newValue:any, oldValue:any){
		super();
		this._target = target;
		this._propertyName = propertyName;
		this._newValue = newValue;
		this._oldValue = oldValue;
	}
	
	public get oldValue():any{
		return this._oldValue;
	}
	
	public get newValue():any{
		return this._newValue;
	}
	
	public get target():any{
		return this._target;
	}
	
	public get propertyName():string{
		return this._propertyName;
	}
	
	public undo():void{
		this._target[this._propertyName] = this._oldValue;
	}
	
	public redo():void{
		this._target[this._propertyName] = this._newValue;
	}
	
}

export class CompositeCommand extends CommandBase{
	private _commands:Array<IUndoRedoCommand>;
	
	public get commands():Array<IUndoRedoCommand>{
		return this._commands;
	}
	
	constructor(commands:Array<IUndoRedoCommand>){
		super();
		this._commands = commands.concat();
	}
	
	public getDuration():number{
		let result:number = 0;
		if(this._commands.length > 0){
			let firstCommand = this._commands[0];
			let lastCommand = this._commands[this._commands.length - 1];
			result = lastCommand.getTimestamp() + lastCommand.getDuration() - firstCommand.getTimestamp();
		}
		return result;
	}
	
	public undo():void{
		let count = this._commands.length;
		for(let i:number = count - 1; i > -1;i--){
			let command:IUndoRedoCommand = this._commands[i];
			command.undo();
		}
	}
	
	public redo():void{
		this._commands.forEach((command:IUndoRedoCommand)=>{
			command.redo();
		});
	}
}

export class AddCommand extends CommandBase{
	private _items:Array<any>;
	
	public get items():Array<any>{
		return this._items;
	}
	
	private _index:number;
	
	public get index():number{
		return this._index;
	}
	
	private _target:ObservableCollection<any>;
	
	public get target():ObservableCollection<any>{
		return this._target;
	}
	
	constructor(target:ObservableCollection<any>, index:number, items:Array<any>){
		super();
		this._items = items.concat();
		this._index = index;
		this._target = target;
	}
	
	public undo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.removeItemAt(this._index);
	}
	
	public redo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.addItemAt(this._items[i], i + this._index);
	} 
}

export class RemoveCommand extends CommandBase{
	private _items:Array<any>;
	
	public get items():Array<any>{
		return this._items;
	}
	
	private _index:number;
	
	public get index():number{
		return this._index;
	}
	
	private _target:ObservableCollection<any>;
	
	public get target():ObservableCollection<any>{
		return this._target;
	}
	
	constructor(target:ObservableCollection<any>, index:number, items:Array<any>){
		super();
		this._items = items.concat();
		this._index = index;
		this._target = target;
	}
	
	public undo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.addItemAt(this._items[i], i + this._index);
	}
	
	public redo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.removeItemAt(this._index);
	} 
}

export class ReplaceCommand extends CommandBase{
	private _items:Array<any>;
	
	public get items():Array<any>{
		return this._items;
	}
	
	private _index:number;
	
	public get index():number{
		return this._index;
	}
	
	private _target:ObservableCollection<any>;
	
	public get target():ObservableCollection<any>{
		return this._target;
	}
	
	constructor(target:ObservableCollection<any>, index:number, items:Array<any>){
		super();
		this._items = items.concat();
		this._index = index;
		this._target = target;
	}
	
	public undo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.addItemAt(this._items[i], i + this._index);
	}
	
	public redo():void{
		for(let i:number = 0; i < this._items.length;i++)
			this._target.removeItemAt(i + this._index);
	} 
}

