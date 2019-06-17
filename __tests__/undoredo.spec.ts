import { UndoRedo } from '../src/undoredo';
import { Point, Style, Polyline } from './model';

describe('UndoRedo', () => {
    it("Undo/redo should correctly set object state", () => {
        const polyline = new Polyline();
        const style = new Style();
        style.alpha = 1;
        style.color = 0xff0000;
        polyline.style = style;

        const undoRedo = new UndoRedo();

        expect(undoRedo.canUndo()).toBe(false);
        expect(undoRedo.canRedo()).toBe(false);

        undoRedo.beginChange(polyline);
        polyline.points.addItem(new Point());
        polyline.points.addItem(new Point());
        undoRedo.endChange("Add points to polyline");

        expect(undoRedo.canUndo()).toBe(true);
        undoRedo.undo();
        expect(polyline.points.numElements).toBe(0);
        undoRedo.redo();
        expect(polyline.points.numElements).toBe(2);

        undoRedo.beginChange(polyline);
        polyline.style.alpha = 0.5;
        polyline.style.color = 0x00ff00;
        undoRedo.endChange("Change style of polyline");

        undoRedo.undo();
        expect(style.alpha == 1 && style.color == 0xff0000).toBe(true);
        undoRedo.redo();
        expect(style.alpha == 0.5 && style.color == 0x00ff00).toBe(true);

        undoRedo.beginChange(polyline);
        polyline.points.removeItemAt(1);
        undoRedo.endChange("Remove point from polyline");

        undoRedo.undo();
        expect(polyline.points.numElements).toBe(2);
        undoRedo.redo();
        expect(polyline.points.numElements).toBe(1);

    });
})

