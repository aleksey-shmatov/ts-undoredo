import { Recorder } from '../src/recorder';
import { CompositeCommand, PropertyChangeCommand, RemoveCommand } from '../src/commands';
import { Point, Style, Polyline } from './model';

describe('Recorder', () => {
    it("Should correctly listen to property changes in nested objects", () => {
        const polyline = new Polyline();
        const style = new Style();
        polyline.style = style;
        const offsetPoint = new Point(0, 0);
        const recorder = new Recorder();
        recorder.begin(polyline);
        polyline.style.color = 0xff0000;
        polyline.style.offset = offsetPoint;
        offsetPoint.x = 1;
        polyline.style.offset = new Point();
        offsetPoint.x = 2;
        const result = recorder.end("Nested change command");
        const compositeCommand: CompositeCommand = <CompositeCommand>result;
        expect(compositeCommand.commands.length).toBe(4);
        const thirdCommand: PropertyChangeCommand = <PropertyChangeCommand>compositeCommand.commands[2];
        expect(thirdCommand.newValue).toBe(1);
        expect(thirdCommand.oldValue).toBe(0);
        expect(polyline.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(style.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(offsetPoint.propertyChanged.listeners('propertyChange').length).toBe(0);
    });
    it("Should correctly listen to property changes in collections", () => {
        const polyline = new Polyline();
        const oldPoint = new Point(0, 0);
        polyline.points.addItem(oldPoint);
        const style = new Style();
        polyline.style = style;
        const recorder = new Recorder();
        const newPoint = new Point(0, 0);

        recorder.begin(polyline);
        polyline.points.addItem(newPoint);
        newPoint.x = 1;
        polyline.points.removeItem(oldPoint);
        oldPoint.x = 1;
        const result = recorder.end("Nested change command");

        const compositeCommand: CompositeCommand = <CompositeCommand>result;
        expect(compositeCommand.commands.length).toBe(3);
        const thirdCommand: RemoveCommand = <RemoveCommand>compositeCommand.commands[2];
        expect(thirdCommand.index).toBe(0);
        expect(thirdCommand.target).toBe(polyline.points);
        expect(thirdCommand.items[0]).toBe(oldPoint);
        expect(polyline.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(style.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(oldPoint.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(newPoint.propertyChanged.listeners('propertyChange').length).toBe(0);
        expect(polyline.points.collectionChanged.listeners('collectionChange').length).toBe(0);
    });
})

