/// <reference path="../typings/tsd.d.ts" /> 
import {Recorder} from '../lib/recorder';
import {IUndoRedoCommand, CompositeCommand, PropertyChangeCommand, RemoveCommand} from '../lib/commands';
import {Point, Style, Polyline} from './model';
import { assert } from 'chai';

describe('Recorder', ()=>{
	it("Should correctly listen to property changes in nested objects", ()=>{
		let polyline = new Polyline();
		let style = new Style();
		polyline.style = style;
		let offsetPoint = new Point(0, 0);
		let recorder = new Recorder();
		recorder.begin(polyline);
		polyline.style.color = 0xff0000;
		polyline.style.offset = offsetPoint;
		offsetPoint.x = 1;
		polyline.style.offset = null;
		offsetPoint.x = 2;
		let result = recorder.end("Nested change command");
		let compositeCommand:CompositeCommand = <CompositeCommand>result;
		assert(compositeCommand.commands.length == 4, "number of commands should be correct");
		let thirdCommand:PropertyChangeCommand = <PropertyChangeCommand>compositeCommand.commands[2];
		assert(thirdCommand.newValue == 1 && thirdCommand.oldValue == 0, "verify that command has proper values");
		assert(polyline.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(style.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(offsetPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
	});
	it("Should correctly listen to property changes in collections", ()=>{
		let polyline = new Polyline();
		let oldPoint = new Point(0, 0);
		polyline.points.addItem(oldPoint);
		let style = new Style();
		polyline.style = style;
		let offsetPoint = new Point(0, 0);
		let recorder = new Recorder();
		let newPoint = new Point(0, 0);
		
		recorder.begin(polyline);
		polyline.points.addItem(newPoint);
		newPoint.x = 1;
		polyline.points.removeItem(oldPoint);
		oldPoint.x = 1;
		let result = recorder.end("Nested change command");
		
		let compositeCommand:CompositeCommand = <CompositeCommand>result;
		assert(compositeCommand.commands.length == 3, "number of commands should be correct");
		let thirdCommand:RemoveCommand = <RemoveCommand>compositeCommand.commands[2];
		assert(thirdCommand.index == 0 && thirdCommand.target == polyline.points && 
			thirdCommand.items[0] == oldPoint, "verify that command has proper values");
		assert(polyline.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(style.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(oldPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(newPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
		assert(polyline.points.collectionChanged.listeners('collectionChange').length == 0, "listeners should be properly removed");
	});
})

