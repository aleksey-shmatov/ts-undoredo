"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CommandBase {
    constructor() {
        this._label = "";
        this._timestamp = new Date().getTime();
    }
    getTimestamp() {
        return this._timestamp;
    }
    getDuration() {
        return 0;
    }
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    undo() {
        throw new Error("Not implemented");
    }
    redo() {
        throw new Error("Not implemented");
    }
}
exports.CommandBase = CommandBase;
class PropertyChangeCommand extends CommandBase {
    constructor(target, propertyName, newValue, oldValue) {
        super();
        this._target = target;
        this._propertyName = propertyName;
        this._newValue = newValue;
        this._oldValue = oldValue;
    }
    get oldValue() {
        return this._oldValue;
    }
    get newValue() {
        return this._newValue;
    }
    get target() {
        return this._target;
    }
    get propertyName() {
        return this._propertyName;
    }
    undo() {
        this._target[this._propertyName] = this._oldValue;
    }
    redo() {
        this._target[this._propertyName] = this._newValue;
    }
}
exports.PropertyChangeCommand = PropertyChangeCommand;
class CompositeCommand extends CommandBase {
    get commands() {
        return this._commands;
    }
    constructor(commands) {
        super();
        this._commands = commands.concat();
    }
    getDuration() {
        let result = 0;
        if (this._commands.length > 0) {
            const firstCommand = this._commands[0];
            const lastCommand = this._commands[this._commands.length - 1];
            result = lastCommand.getTimestamp() + lastCommand.getDuration() - firstCommand.getTimestamp();
        }
        return result;
    }
    undo() {
        let count = this._commands.length;
        for (let i = count - 1; i > -1; i--) {
            const command = this._commands[i];
            command.undo();
        }
    }
    redo() {
        this._commands.forEach((command) => {
            command.redo();
        });
    }
}
exports.CompositeCommand = CompositeCommand;
class AddCommand extends CommandBase {
    get items() {
        return this._items;
    }
    get index() {
        return this._index;
    }
    get target() {
        return this._target;
    }
    constructor(target, index, items) {
        super();
        this._items = items.concat();
        this._index = index;
        this._target = target;
    }
    undo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.removeItemAt(this._index);
    }
    redo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    }
}
exports.AddCommand = AddCommand;
class RemoveCommand extends CommandBase {
    get items() {
        return this._items;
    }
    get index() {
        return this._index;
    }
    get target() {
        return this._target;
    }
    constructor(target, index, items) {
        super();
        this._items = items.concat();
        this._index = index;
        this._target = target;
    }
    undo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    }
    redo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.removeItemAt(this._index);
    }
}
exports.RemoveCommand = RemoveCommand;
class ReplaceCommand extends CommandBase {
    get items() {
        return this._items;
    }
    get index() {
        return this._index;
    }
    get target() {
        return this._target;
    }
    constructor(target, index, items) {
        super();
        this._items = [...items];
        this._index = index;
        this._target = target;
    }
    undo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.addItemAt(this._items[i], i + this._index);
    }
    redo() {
        for (let i = 0; i < this._items.length; i++)
            this._target.removeItemAt(i + this._index);
    }
}
exports.ReplaceCommand = ReplaceCommand;
