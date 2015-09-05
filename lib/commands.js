var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CommandBase = (function () {
    function CommandBase() {
        this._timestamp = new Date().getTime();
    }
    CommandBase.prototype.getTimestamp = function () {
        return this._timestamp;
    };
    CommandBase.prototype.getDuration = function () {
        return 0;
    };
    Object.defineProperty(CommandBase.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = value;
        },
        enumerable: true,
        configurable: true
    });
    CommandBase.prototype.undo = function () {
        throw new Error("Not implemented");
    };
    CommandBase.prototype.redo = function () {
        throw new Error("Not implemented");
    };
    return CommandBase;
})();
exports.CommandBase = CommandBase;
var PropertyChangeCommand = (function (_super) {
    __extends(PropertyChangeCommand, _super);
    function PropertyChangeCommand(target, propertyName, newValue, oldValue) {
        _super.call(this);
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
})(CommandBase);
exports.PropertyChangeCommand = PropertyChangeCommand;
var CompositeCommand = (function (_super) {
    __extends(CompositeCommand, _super);
    function CompositeCommand(commands) {
        _super.call(this);
        this._commands = commands.concat();
    }
    Object.defineProperty(CompositeCommand.prototype, "commands", {
        get: function () {
            return this._commands;
        },
        enumerable: true,
        configurable: true
    });
    CompositeCommand.prototype.getDuration = function () {
        var result = 0;
        if (this._commands.length > 0) {
            var firstCommand = this._commands[0];
            var lastCommand = this._commands[this._commands.length - 1];
            result = lastCommand.getTimestamp() + lastCommand.getDuration() - firstCommand.getTimestamp();
        }
        return result;
    };
    CompositeCommand.prototype.undo = function () {
        var count = this._commands.length;
        for (var i = count - 1; i > -1; i--) {
            var command = this._commands[i];
            command.undo();
        }
    };
    CompositeCommand.prototype.redo = function () {
        this._commands.forEach(function (command) {
            command.redo();
        });
    };
    return CompositeCommand;
})(CommandBase);
exports.CompositeCommand = CompositeCommand;
var AddCommand = (function (_super) {
    __extends(AddCommand, _super);
    function AddCommand(target, index, items) {
        _super.call(this);
        this._items = items.concat();
        this._index = index;
        this._target = target;
    }
    Object.defineProperty(AddCommand.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddCommand.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AddCommand.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    AddCommand.prototype.undo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.removeItemAt(this._index);
    };
    AddCommand.prototype.redo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    };
    return AddCommand;
})(CommandBase);
exports.AddCommand = AddCommand;
var RemoveCommand = (function (_super) {
    __extends(RemoveCommand, _super);
    function RemoveCommand(target, index, items) {
        _super.call(this);
        this._items = items.concat();
        this._index = index;
        this._target = target;
    }
    Object.defineProperty(RemoveCommand.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveCommand.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoveCommand.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    RemoveCommand.prototype.undo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    };
    RemoveCommand.prototype.redo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.removeItemAt(this._index);
    };
    return RemoveCommand;
})(CommandBase);
exports.RemoveCommand = RemoveCommand;
var ReplaceCommand = (function (_super) {
    __extends(ReplaceCommand, _super);
    function ReplaceCommand(target, index, items) {
        _super.call(this);
        this._items = items.concat();
        this._index = index;
        this._target = target;
    }
    Object.defineProperty(ReplaceCommand.prototype, "items", {
        get: function () {
            return this._items;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReplaceCommand.prototype, "index", {
        get: function () {
            return this._index;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReplaceCommand.prototype, "target", {
        get: function () {
            return this._target;
        },
        enumerable: true,
        configurable: true
    });
    ReplaceCommand.prototype.undo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    };
    ReplaceCommand.prototype.redo = function () {
        for (var i = 0; i < this._items.length; i++)
            this._target.removeItemAt(i + this._index);
    };
    return ReplaceCommand;
})(CommandBase);
exports.ReplaceCommand = ReplaceCommand;
//# sourceMappingURL=commands.js.map