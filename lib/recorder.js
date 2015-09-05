/// <reference path="../node_modules/ts-events/ts-events.d.ts" />
/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
var commands = require('./commands');
var ts_observable_1 = require('ts-observable');
var Recorder = (function () {
    function Recorder() {
        this._commands = null;
    }
    Recorder.prototype.begin = function (target) {
        if (this._commands != null) {
            throw new Error("Commands recorder is already running");
        }
        this._commands = [];
        this._root = target;
        this.listen(target);
    };
    Recorder.prototype.isObservableCollection = function (value) {
        return (typeof value == "object") && (value != null) && (value instanceof ts_observable_1.ObservableCollection);
    };
    Recorder.prototype.isObservable = function (value) {
        return (typeof value == "object") && (value != null) && ("propertyChanged" in value);
    };
    Recorder.prototype.tryListen = function (value) {
        if (this.isObservable(value)) {
            this.listen(value);
        }
        else if (this.isObservableCollection(value)) {
            this.listenAll(value);
        }
    };
    Recorder.prototype.listen = function (target) {
        target.propertyChanged.attach(this, this.onPropertyChange);
        for (var property in target) {
            var value = target[property];
            this.tryListen(value);
        }
    };
    Recorder.prototype.listenAll = function (target) {
        target.collectionChanged.attach(this, this.onCollectionChanged);
        for (var i = 0; i < target.numElements; i++) {
            var item = target.getItemAt(i);
            this.tryListen(item);
        }
    };
    Recorder.prototype.tryUnlisten = function (value) {
        if (this.isObservable(value)) {
            this.unlisten(value);
        }
        else if (this.isObservableCollection(value)) {
            this.unlistentAll(value);
        }
    };
    Recorder.prototype.unlisten = function (target) {
        target.propertyChanged.detach(this, this.onPropertyChange);
        for (var property in target) {
            var value = target[property];
            this.tryUnlisten(value);
        }
    };
    Recorder.prototype.unlistentAll = function (target) {
        target.collectionChanged.detach(this, this.onCollectionChanged);
        for (var i = 0; i < target.numElements; i++) {
            var item = target.getItemAt(i);
            this.tryUnlisten(item);
        }
    };
    Recorder.prototype.onPropertyChange = function (info) {
        var command = new commands.PropertyChangeCommand(info.target, info.propertyName, info.newValue, info.oldValue);
        this.tryUnlisten(info.oldValue);
        this.tryListen(info.newValue);
        this._commands.push(command);
    };
    Recorder.prototype.onCollectionChanged = function (info) {
        var command;
        switch (info.action) {
            case ts_observable_1.CollectionChangeAction.Add:
                command = new commands.AddCommand(info.target, info.newIndex, info.newItems);
                for (var i = 0; i < info.newItems.length; i++) {
                    this.tryListen(info.newItems[i]);
                }
                break;
            case ts_observable_1.CollectionChangeAction.Remove:
                command = new commands.RemoveCommand(info.target, info.oldIndex, info.oldItems);
                for (var i = 0; i < info.oldItems.length; i++) {
                    this.tryUnlisten(info.oldItems[i]);
                }
                break;
            default:
                throw new Error("Handling of action " + info.action + " is not implemented");
                break;
        }
        this._commands.push(command);
    };
    Recorder.prototype.end = function (description) {
        if (description === void 0) { description = ""; }
        this.unlisten(this._root);
        var result = null;
        if (this._commands.length == 1)
            result = this._commands[0];
        else
            result = new commands.CompositeCommand(this._commands);
        this._commands = null;
        result.label = description;
        return result;
    };
    return Recorder;
})();
exports.Recorder = Recorder;
//# sourceMappingURL=recorder.js.map