/// <reference path="../typings/tsd.d.ts" /> 
var undoredo_1 = require('../lib/undoredo');
var model_1 = require('./model');
var chai_1 = require('chai');
describe('UndoRedo', function () {
    it("Undo/redo should correctly set object state", function () {
        var polyline = new model_1.Polyline();
        var style = new model_1.Style();
        style.alpha = 1;
        style.color = 0xff0000;
        polyline.style = style;
        var undoRedo = new undoredo_1.UndoRedo();
        chai_1.assert(undoRedo.canUndo() == false, "Should not be able to undo on empty state");
        chai_1.assert(undoRedo.canRedo() == false, "Should not be able to redo on empty state");
        undoRedo.beginChange(polyline);
        polyline.points.addItem(new model_1.Point());
        polyline.points.addItem(new model_1.Point());
        undoRedo.endChange("Add points to polyline");
        chai_1.assert(undoRedo.canUndo(), "Should  be able to undo");
        undoRedo.undo();
        chai_1.assert(polyline.points.numElements == 0, "Should be zero points after undo");
        undoRedo.redo();
        chai_1.assert(polyline.points.numElements == 2, "Should be two points after redo");
        undoRedo.beginChange(polyline);
        polyline.style.alpha = 0.5;
        polyline.style.color = 0x00ff00;
        undoRedo.endChange("Change style of polyline");
        undoRedo.undo();
        chai_1.assert(style.alpha == 1 && style.color == 0xff0000, "Should restore style properties after undo");
        undoRedo.redo();
        chai_1.assert(style.alpha == 0.5 && style.color == 0x00ff00, "Should set new properties back after redo");
        undoRedo.beginChange(polyline);
        polyline.points.removeItemAt(1);
        undoRedo.endChange("Remove point from polyline");
        undoRedo.undo();
        chai_1.assert(polyline.points.numElements == 2, "Should be two points after undo");
        undoRedo.redo();
        chai_1.assert(polyline.points.numElements == 1, "Should be 1 points after redo");
    });
});
//# sourceMappingURL=undoredo.spec.js.map