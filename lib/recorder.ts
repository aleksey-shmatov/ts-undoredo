/// <reference path="../node_modules/ts-events/ts-events.d.ts" />
/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import * as commands from './commands';
import {INotifyPropertyChanged, PropertyChangeEvent, PropertyChangeInfo} from 'ts-observable';

export class Recorder{
	
	private _commands:Array<commands.IUndoRedoCommand>;
	
	constructor(){
		this._commands = null;
	}
	
	public begin(target:INotifyPropertyChanged):void{
		if(this._commands != null){
			throw new Error("Commands recorder is already running");
		}
		this._commands = [];
		this.listen(target);
	}
	
	private listen(target:INotifyPropertyChanged):void{
		target.propertyChanged.attach(this.onPropertyChange);
		for(let property in target){
			let value:any = target[property];
			if("propertyChanged" in value){
				var propertyValue = value["propertyChanged"];
				this.listen(propertyValue);
			}
		}
	}
	
	private onPropertyChange(info:PropertyChangeInfo):void{
		let command = new commands.PropertyChangeCommand(info.target, info.propertyName, info.newValue, info.oldValue);
		this._commands.push(command);
	}
	
	public end():commands.IUndoRedoCommand{
		var result:commands.IUndoRedoCommand = null;
		if(this._commands.length == 1)
			result = this._commands[0];
		else	
			result = new commands.CompositeCommand(this._commands);
		this._commands = null;
		return result;
	}
}