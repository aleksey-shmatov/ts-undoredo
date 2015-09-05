/// <reference path="../typings/tsd.d.ts" /> 
import {UndoRedo} from '../lib/undoredo';
import {Point, Style, Polyline} from './model';
import { assert } from 'chai';

describe('UndoRedo', ()=>{
	it("Undo/redo should correctly set object state", ()=>{
		let polyline = new Polyline();
		let style = new Style();
		style.alpha = 1;
		style.color = 0xff0000;
		polyline.style = style;
		
		let undoRedo = new UndoRedo();
		
		assert(undoRedo.canUndo() == false, "Should not be able to undo on empty state");
		assert(undoRedo.canRedo() == false, "Should not be able to redo on empty state");
		
		undoRedo.beginChange(polyline);
		polyline.points.addItem(new Point());
		polyline.points.addItem(new Point());
		undoRedo.endChange("Add points to polyline");
		
		assert(undoRedo.canUndo(), "Should  be able to undo");
		undoRedo.undo();
		assert(polyline.points.numElements == 0, "Should be zero points after undo");
		undoRedo.redo();
		assert(polyline.points.numElements == 2, "Should be two points after redo");
		
		undoRedo.beginChange(polyline);
		polyline.style.alpha = 0.5;
		polyline.style.color = 0x00ff00;
		undoRedo.endChange("Change style of polyline");
		
		undoRedo.undo();
		assert(style.alpha == 1 && style.color == 0xff0000, "Should restore style properties after undo");
		undoRedo.redo();
		assert(style.alpha == 0.5 && style.color == 0x00ff00, "Should set new properties back after redo");
		
		undoRedo.beginChange(polyline);
		polyline.points.removeItemAt(1);
		undoRedo.endChange("Remove point from polyline");
	
		undoRedo.undo();
		assert(polyline.points.numElements == 2, "Should be two points after undo");
		undoRedo.redo();
		assert(polyline.points.numElements == 1, "Should be 1 points after redo");
	
	});
})

