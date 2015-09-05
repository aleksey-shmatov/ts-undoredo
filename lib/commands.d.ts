/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import { ObservableCollection } from 'ts-observable';
export interface IUndoRedoCommand {
    getTimestamp(): number;
    getDuration(): number;
    label: string;
    undo(): void;
    redo(): void;
}
export declare class CommandBase implements IUndoRedoCommand {
    private _timestamp;
    private _label;
    constructor();
    getTimestamp(): number;
    getDuration(): number;
    label: string;
    undo(): void;
    redo(): void;
}
export declare class PropertyChangeCommand extends CommandBase {
    private _propertyName;
    private _oldValue;
    private _newValue;
    private _target;
    constructor(target: any, propertyName: string, newValue: any, oldValue: any);
    oldValue: any;
    newValue: any;
    target: any;
    propertyName: string;
    undo(): void;
    redo(): void;
}
export declare class CompositeCommand extends CommandBase {
    private _commands;
    commands: Array<IUndoRedoCommand>;
    constructor(commands: Array<IUndoRedoCommand>);
    getDuration(): number;
    undo(): void;
    redo(): void;
}
export declare class AddCommand extends CommandBase {
    private _items;
    items: Array<any>;
    private _index;
    index: number;
    private _target;
    target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: Array<any>);
    undo(): void;
    redo(): void;
}
export declare class RemoveCommand extends CommandBase {
    private _items;
    items: Array<any>;
    private _index;
    index: number;
    private _target;
    target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: Array<any>);
    undo(): void;
    redo(): void;
}
export declare class ReplaceCommand extends CommandBase {
    private _items;
    items: Array<any>;
    private _index;
    index: number;
    private _target;
    target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: Array<any>);
    undo(): void;
    redo(): void;
}
