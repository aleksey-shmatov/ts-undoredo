import * as commands from './commands';
import { NotifyPropertyChanged } from 'ts-observable';
export declare class UndoRedo {
    private _stack;
    private _stackIndex;
    canUndo(): boolean;
    canRedo(): boolean;
    clear(): void;
    add(cmd: commands.UndoRedoCommand): void;
    undo(): void;
    redo(): void;
    private _recorder;
    change(target: NotifyPropertyChanged, changeFunction: (target: NotifyPropertyChanged) => string): void;
    beginChange(target: NotifyPropertyChanged): void;
    endChange(description: string): void;
}
