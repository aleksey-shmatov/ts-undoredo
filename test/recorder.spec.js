var recorder_1 = require('../lib/recorder');
var model_1 = require('./model');
var chai_1 = require('chai');
describe('Recorder', function () {
    it("Should correctly listen to property changes in nested objects", function () {
        var polyline = new model_1.Polyline();
        var style = new model_1.Style();
        polyline.style = style;
        var offsetPoint = new model_1.Point(0, 0);
        var recorder = new recorder_1.Recorder();
        recorder.begin(polyline);
        polyline.style.color = 0xff0000;
        polyline.style.offset = offsetPoint;
        offsetPoint.x = 1;
        polyline.style.offset = null;
        offsetPoint.x = 2;
        var result = recorder.end("Nested change command");
        var compositeCommand = result;
        chai_1.assert(compositeCommand.commands.length == 4, "number of commands should be correct");
        var thirdCommand = compositeCommand.commands[2];
        chai_1.assert(thirdCommand.newValue == 1 && thirdCommand.oldValue == 0, "verify that command has proper values");
        chai_1.assert(polyline.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(style.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(offsetPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
    });
    it("Should correctly listen to property changes in collections", function () {
        var polyline = new model_1.Polyline();
        var oldPoint = new model_1.Point(0, 0);
        polyline.points.addItem(oldPoint);
        var style = new model_1.Style();
        polyline.style = style;
        var offsetPoint = new model_1.Point(0, 0);
        var recorder = new recorder_1.Recorder();
        var newPoint = new model_1.Point(0, 0);
        recorder.begin(polyline);
        polyline.points.addItem(newPoint);
        newPoint.x = 1;
        polyline.points.removeItem(oldPoint);
        oldPoint.x = 1;
        var result = recorder.end("Nested change command");
        var compositeCommand = result;
        chai_1.assert(compositeCommand.commands.length == 3, "number of commands should be correct");
        var thirdCommand = compositeCommand.commands[2];
        chai_1.assert(thirdCommand.index == 0 && thirdCommand.target == polyline.points &&
            thirdCommand.items[0] == oldPoint, "verify that command has proper values");
        chai_1.assert(polyline.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(style.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(oldPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(newPoint.propertyChanged.listeners('propertyChange').length == 0, "listeners should be properly removed");
        chai_1.assert(polyline.points.collectionChanged.listeners('collectionChange').length == 0, "listeners should be properly removed");
    });
});
//# sourceMappingURL=recorder.spec.js.map