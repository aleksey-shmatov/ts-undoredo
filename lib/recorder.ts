/// <reference path="../node_modules/ts-events/ts-events.d.ts" />
/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import * as commands from './commands';
import {INotifyPropertyChanged, PropertyChangeEvent, PropertyChangeInfo, 
	ObservableCollection, CollectionChangeInfo, CollectionChangeAction, INotifyCollectionChanged} from 'ts-observable';

export class Recorder{
	
	private _commands:Array<commands.IUndoRedoCommand>;
	private _root:INotifyPropertyChanged;
	
	constructor(){
		this._commands = null;
	}
	
	public begin(target:INotifyPropertyChanged):void{
		if(this._commands != null){
			throw new Error("Commands recorder is already running");
		}
		this._commands = [];
		this._root = target;
		this.listen(target);
	}
	
	private isObservableCollection(value:any):boolean{
		return (typeof value == "object") && (value != null) && (value instanceof ObservableCollection);
	}
	
	private isObservable(value:any):boolean{
		return (typeof value == "object") && (value != null) && ("propertyChanged" in value);
	}
	
	private tryListen(value:any):void{
		if(this.isObservable(value)){
			this.listen(value);
		}
		else if(this.isObservableCollection(value)){
			this.listenAll(value);
		}
	}
	
	private listen(target:INotifyPropertyChanged):void{
		target.propertyChanged.attach(this, this.onPropertyChange);
		for(let property in target){
			let value:any = target[property];
			this.tryListen(value);
		}
	}
	
	private listenAll(target:ObservableCollection<any>):void{
		target.collectionChanged.attach(this, this.onCollectionChanged);
		for(let i:number = 0; i < target.numElements;i++){
			var item:any = target.getItemAt(i);
			this.tryListen(item);
		}
	}
	
	private tryUnlisten(value:any):void{
		if(this.isObservable(value)){
			this.unlisten(value);
		}
		else if(this.isObservableCollection(value)){
			this.unlistentAll(value);
		}
	}
	
	private unlisten(target:INotifyPropertyChanged):void{
		target.propertyChanged.detach(this, this.onPropertyChange);
		for(let property in target){
			let value:any = target[property];
			this.tryUnlisten(value);
		}
	}
	
	private unlistentAll(target:ObservableCollection<any>):void{
		target.collectionChanged.detach(this, this.onCollectionChanged);
		for(let i:number = 0; i < target.numElements;i++){
			var item:any = target.getItemAt(i);
			this.tryUnlisten(item);
		}
	}
	
	private onPropertyChange(info:PropertyChangeInfo):void{
		let command = new commands.PropertyChangeCommand(info.target, info.propertyName, info.newValue, info.oldValue);
		this.tryUnlisten(info.oldValue);
		this.tryListen(info.newValue);
		this._commands.push(command);
	}
	
	private onCollectionChanged(info:CollectionChangeInfo):void{
		let command:commands.IUndoRedoCommand;
		switch(info.action){
			case CollectionChangeAction.Add:
				command = new commands.AddCommand(info.target, info.newIndex, info.newItems);
				for(let i:number = 0; i < info.newItems.length; i++){
					this.tryListen(info.newItems[i]);
				}
			break;
			case CollectionChangeAction.Remove:
				command = new commands.RemoveCommand(info.target, info.oldIndex, info.oldItems);
				for(let i:number = 0; i < info.oldItems.length; i++){
					this.tryUnlisten(info.oldItems[i]);
				}					
			break;
			default:
				throw new Error(`Handling of action ${info.action} is not implemented`);
			break;
		}
		this._commands.push(command);	
	}
	
	public end(description:string = ""):commands.IUndoRedoCommand{
		this.unlisten(this._root);
		var result:commands.IUndoRedoCommand = null;
		if(this._commands.length == 1)
			result = this._commands[0];
		else	
			result = new commands.CompositeCommand(this._commands);
		this._commands = null;
		result.label = description;
		return result;
	}
}