import * as commands from './commands';
import {
    NotifyPropertyChanged,
    PropertyChangeInfo,
    ObservableCollection, CollectionChangeInfo,
    CollectionChangeAction
} from 'ts-observable';

interface RecordableTarget extends NotifyPropertyChanged {
    [key: string]: any;
}

export class Recorder {

    private _commands: commands.UndoRedoCommand[];
    private _root?: NotifyPropertyChanged;

    public constructor() {
        this._commands = [];
    }

    public begin(target: NotifyPropertyChanged): void {
        if (this._root) {
            throw new Error("Commands recorder is already running");
        }
        this._commands = [];
        this._root = target;
        this.listen(target);
    }

    private isObservableCollection(value: any): boolean {
        return (typeof value == "object") && (value != null) && (value instanceof ObservableCollection);
    }

    private isObservable(value: any): boolean {
        return (typeof value == "object") && (value != null) && ("propertyChanged" in value);
    }

    private tryListen(value: any): void {
        if (this.isObservable(value)) {
            this.listen(value);
        }
        else if (this.isObservableCollection(value)) {
            this.listenAll(value);
        }
    }

    private listen(target: RecordableTarget): void {
        target.propertyChanged.listen(this.onPropertyChange, this);
        for (let property in target) {
            const value: any = target[property];
            this.tryListen(value);
        }
    }

    private listenAll(target: ObservableCollection<any>): void {
        target.collectionChanged.listen(this.onCollectionChanged, this);
        for (let i = 0; i < target.numElements; i++) {
            const item: any = target.getItemAt(i);
            this.tryListen(item);
        }
    }

    private tryUnlisten(value: any): void {
        if (this.isObservable(value)) {
            this.unlisten(value);
        }
        else if (this.isObservableCollection(value)) {
            this.unlistentAll(value);
        }
    }

    private unlisten(target: RecordableTarget): void {
        target.propertyChanged.unlisten(this.onPropertyChange);
        for (let property in target) {
            const value: any = target[property];
            this.tryUnlisten(value);
        }
    }

    private unlistentAll(target: ObservableCollection<any>): void {
        target.collectionChanged.unlisten(this.onCollectionChanged);
        for (let i = 0; i < target.numElements; i++) {
            const item: any = target.getItemAt(i);
            this.tryUnlisten(item);
        }
    }

    private onPropertyChange(info: PropertyChangeInfo): void {
        const command = new commands.PropertyChangeCommand(info.target, info.propertyName, info.newValue, info.oldValue);
        this.tryUnlisten(info.oldValue);
        this.tryListen(info.newValue);
        this._commands.push(command);
    }

    private onCollectionChanged(info: CollectionChangeInfo): void {
        let command: commands.UndoRedoCommand;
        switch (info.action) {
            case CollectionChangeAction.Add:
                command = new commands.AddCommand(info.target, info.newIndex, info.newItems);
                for (let i = 0; i < info.newItems.length; i++) {
                    this.tryListen(info.newItems[i]);
                }
                break;
            case CollectionChangeAction.Remove:
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

    public end(description: string = ""): commands.UndoRedoCommand | null {
        let result: commands.UndoRedoCommand | null = null;
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