import { ObservableCollection } from 'ts-observable';
export interface UndoRedoCommand {
    getTimestamp(): number;
    getDuration(): number;
    label: string;
    undo(): void;
    redo(): void;
}
export declare class CommandBase implements UndoRedoCommand {
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
    readonly oldValue: any;
    readonly newValue: any;
    readonly target: any;
    readonly propertyName: string;
    undo(): void;
    redo(): void;
}
export declare class CompositeCommand extends CommandBase {
    private _commands;
    readonly commands: UndoRedoCommand[];
    constructor(commands: UndoRedoCommand[]);
    getDuration(): number;
    undo(): void;
    redo(): void;
}
export declare class AddCommand extends CommandBase {
    private _items;
    readonly items: any[];
    private _index;
    readonly index: number;
    private _target;
    readonly target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: any[]);
    undo(): void;
    redo(): void;
}
export declare class RemoveCommand extends CommandBase {
    private _items;
    readonly items: any[];
    private _index;
    readonly index: number;
    private _target;
    readonly target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: any[]);
    undo(): void;
    redo(): void;
}
export declare class ReplaceCommand extends CommandBase {
    private _items;
    readonly items: any[];
    private _index;
    readonly index: number;
    private _target;
    readonly target: ObservableCollection<any>;
    constructor(target: ObservableCollection<any>, index: number, items: any[]);
    undo(): void;
    redo(): void;
}
