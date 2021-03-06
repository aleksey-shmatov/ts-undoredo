"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const commands = __importStar(require("./commands"));
const ts_observable_1 = require("ts-observable");
class Recorder {
    constructor() {
        this._commands = [];
    }
    begin(target) {
        if (this._root) {
            throw new Error("Commands recorder is already running");
        }
        this._commands = [];
        this._root = target;
        this.listen(target);
    }
    isObservableCollection(value) {
        return (typeof value == "object") && (value != null) && (value instanceof ts_observable_1.ObservableCollection);
    }
    isObservable(value) {
        return (typeof value == "object") && (value != null) && ("propertyChanged" in value);
    }
    tryListen(value) {
        if (this.isObservable(value)) {
            this.listen(value);
        }
        else if (this.isObservableCollection(value)) {
            this.listenAll(value);
        }
    }
    listen(target) {
        target.propertyChanged.listen(this.onPropertyChange, this);
        for (let property in target) {
            const value = target[property];
            this.tryListen(value);
        }
    }
    listenAll(target) {
        target.collectionChanged.listen(this.onCollectionChanged, this);
        for (let i = 0; i < target.numElements; i++) {
            const item = target.getItemAt(i);
            this.tryListen(item);
        }
    }
    tryUnlisten(value) {
        if (this.isObservable(value)) {
            this.unlisten(value);
        }
        else if (this.isObservableCollection(value)) {
            this.unlistentAll(value);
        }
    }
    unlisten(target) {
        target.propertyChanged.unlisten(this.onPropertyChange);
        for (let property in target) {
            const value = target[property];
            this.tryUnlisten(value);
        }
    }
    unlistentAll(target) {
        target.collectionChanged.unlisten(this.onCollectionChanged);
        for (let i = 0; i < target.numElements; i++) {
            const item = target.getItemAt(i);
            this.tryUnlisten(item);
        }
    }
    onPropertyChange(info) {
        const command = new commands.PropertyChangeCommand(info.target, info.propertyName, info.newValue, info.oldValue);
        this.tryUnlisten(info.oldValue);
        this.tryListen(info.newValue);
        this._commands.push(command);
    }
    onCollectionChanged(info) {
        let command;
        switch (info.action) {
            case ts_observable_1.CollectionChangeAction.Add:
                command = new commands.AddCommand(info.target, info.newIndex, info.newItems);
                for (let i = 0; i < info.newItems.length; i++) {
                    this.tryListen(info.newItems[i]);
                }
                break;
            case ts_observable_1.CollectionChangeAction.Remove:
                command = new commands.RemoveCommand(info.target, info.oldIndex, info.oldItems);
                for (let i = 0; i < info.oldItems.length; i++) {
                    this.tryUnlisten(info.oldItems[i]);
                }
                break;
            default:
                throw new Error(`Handling of action ${info.action} is not implemented`);
        }
        this._commands.push(command);
    }
    end(description = "") {
        let result = null;
        if (this._root) {
            this.unlisten(this._root);
            if (this._commands.length == 1) {
                result = this._commands[0];
            }
            else {
                result = new commands.CompositeCommand(this._commands);
            }
            this._commands = [];
            this._root = undefined;
            result.label = description;
        }
        return result;
    }
}
exports.Recorder = Recorder;
