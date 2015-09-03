/// <reference path="../typings/lodash/lodash.d.ts" />
var _ = require('lodash');
var PropertyChangeCommand = (function () {
    function PropertyChangeCommand(target, propertyName, newValue, oldValue) {
        this._target = target;
        this._propertyName = propertyName;
        this._newValue = newValue;
        this._oldValue = oldValue;
    }
    Object.defineProperty(PropertyChangeCommand.prototype, "oldValue", {
        get: function () {
            return this._oldValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyChangeCommand.prototype, "newValue", {
        get: function () {
            return this._newValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyChangeCommand.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PropertyChangeCommand.prototype, "propertyName", {
        get: function () {
            return this._propertyName;
        },
        enumerable: true,
        configurable: true
    });
    PropertyChangeCommand.prototype.undo = function () {
        this._target[this._propertyName] = this._oldValue;
    };
    PropertyChangeCommand.prototype.redo = function () {
        this._target[this._propertyName] = this._newValue;
    };
    return PropertyChangeCommand;
})();
exports.PropertyChangeCommand = PropertyChangeCommand;
var CompositeCommand = (function () {
    function CompositeCommand(commands) {
        this._commands = commands.concat();
    }
    Object.defineProperty(CompositeCommand.prototype, "commands", {
        get: function () {
            return this._commands;
        },
        enumerable: true,
        configurable: true
    });
    CompositeCommand.prototype.undo = function () {
        _.forEach(this._commands, function (command) {
            command.undo();
        });
    };
    CompositeCommand.prototype.redo = function () {
        _.forEach(this._commands, function (command) {
            command.redo();
        });
    };
    return CompositeCommand;
})();
exports.CompositeCommand = CompositeCommand;
//# sourceMappingURL=commands.js.map