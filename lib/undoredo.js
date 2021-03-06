"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const recorder_1 = require("./recorder");
class UndoRedo {
    constructor() {
        this._stack = [];
        this._stackIndex = -1;
        this._recorder = new recorder_1.Recorder();
    }
    canUndo() {
        return this._stackIndex > 0;
    }
    canRedo() {
        return (this._stackIndex < this._stack.length) && this._stack.length > 0;
    }
    clear() {
        this._stack = [];
        this._stackIndex = -1;
    }
    add(cmd) {
        if (this.canRedo()) {
            this._stack.splice(this._stackIndex, this._stack.length);
        }
        this._stack.push(cmd);
        this._stackIndex = this._stack.length;
    }
    undo() {
        if (this.canUndo()) {
            this._stackIndex--;
            this._stack[this._stackIndex].undo();
        }
    }
    redo() {
        if (this.canRedo()) {
            this._stack[this._stackIndex].redo();
            this._stackIndex++;
        }
    }
    change(target, changeFunction) {
        this.beginChange(target);
        let descrition = changeFunction(target);
        this.endChange(descrition);
    }
    beginChange(target) {
        this._recorder.begin(target);
    }
    endChange(description) {
        let result = this._recorder.end(description);
        if (result) {
            this.add(result);
        }
    }
}
exports.UndoRedo = UndoRedo;
