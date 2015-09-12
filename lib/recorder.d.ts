/// <reference path="../node_modules/ts-observable/ts-observable.d.ts" />
import * as commands from './commands';
import { INotifyPropertyChanged } from 'ts-observable';
export declare class Recorder {
    private _commands;
    private _root;
    constructor();
    begin(target: INotifyPropertyChanged): void;
    private isObservableCollection(value);
    private isObservable(value);
    private tryListen(value);
    private listen(target);
    private listenAll(target);
    private tryUnlisten(value);
    private unlisten(target);
    private unlistentAll(target);
    private onPropertyChange(info);
    private onCollectionChanged(info);
    end(description?: string): commands.IUndoRedoCommand;
}
