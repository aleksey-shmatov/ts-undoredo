var recorder_1 = require('./recorder');
var UndoRedo = (function () {
    function UndoRedo() {
        this._stack = [];
        this._stackIndex = -1;
        this._recorder = new recorder_1.Recorder();
    }
    UndoRedo.prototype.canUndo = function () {
        return this._stackIndex > 0;
    };
    UndoRedo.prototype.canRedo = function () {
        return (this._stackIndex < this._stack.length) && this._stack.length > 0;
    };
    UndoRedo.prototype.clear = function () {
        this._stack = [];
        this._stackIndex = -1;
    };
    UndoRedo.prototype.add = function (cmd) {
        if (this.canRedo()) {
            this._stack.splice(this._stackIndex, this._stack.length);
        }
        this._stack.push(cmd);
        this._stackIndex = this._stack.length;
    };
    UndoRedo.prototype.undo = function () {
        if (this.canUndo()) {
            this._stackIndex--;
            this._stack[this._stackIndex].undo();
        }
    };
    UndoRedo.prototype.redo = function () {
        if (this.canRedo()) {
            this._stack[this._stackIndex].redo();
            this._stackIndex++;
        }
    };
    UndoRedo.prototype.change = function (target, changeFunction) {
        this.beginChange(target);
        var descrition = changeFunction(target);
        this.endChange(descrition);
    };
    UndoRedo.prototype.beginChange = function (target) {
        this._recorder.begin(target);
    };
    UndoRedo.prototype.endChange = function (description) {
        var result = this._recorder.end(description);
        if (result) {
            this.add(result);
        }
    };
    return UndoRedo;
})();
exports.UndoRedo = UndoRedo;
//# sourceMappingURL=undoredo.js.map