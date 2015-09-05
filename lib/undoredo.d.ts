import * as commands from './commands';
import { INotifyPropertyChanged } from 'ts-observable';
export declare class UndoRedo {
    private _stack;
    private _stackIndex;
    canUndo(): Boolean;
    canRedo(): Boolean;
    clear(): void;
    add(cmd: commands.IUndoRedoCommand): void;
    undo(): void;
    redo(): void;
    private _recorder;
    change(target: INotifyPropertyChanged, changeFunction: (target: INotifyPropertyChanged) => string): void;
    beginChange(target: INotifyPropertyChanged): void;
    endChange(description: string): void;
}
