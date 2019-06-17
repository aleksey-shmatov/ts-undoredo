import * as commands from './commands';
import { NotifyPropertyChanged } from 'ts-observable';
export declare class Recorder {
    private _commands;
    private _root?;
    constructor();
    begin(target: NotifyPropertyChanged): void;
    private isObservableCollection;
    private isObservable;
    private tryListen;
    private listen;
    private listenAll;
    private tryUnlisten;
    private unlisten;
    private unlistentAll;
    private onPropertyChange;
    private onCollectionChanged;
    end(description?: string): commands.UndoRedoCommand | null;
}
