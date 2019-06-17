import * as commands from './commands';
import { Recorder } from './recorder';
import { NotifyPropertyChanged } from 'ts-observable';

export class UndoRedo {
    private _stack: commands.UndoRedoCommand[] = [];
    private _stackIndex: number = -1;

    public canUndo(): boolean {
        return this._stackIndex > 0
    }

    public canRedo(): boolean {
        return (this._stackIndex < this._stack.length) && this._stack.length > 0;
    }

    public clear(): void {
        this._stack = [];
        this._stackIndex = -1;
    }

    public add(cmd: commands.UndoRedoCommand): void {
        if (this.canRedo()) {
            this._stack.splice(this._stackIndex, this._stack.length);
        }
        this._stack.push(cmd);
        this._stackIndex = this._stack.length;
    }

    public undo(): void {
        if (this.canUndo()) {
            this._stackIndex--;
            this._stack[this._stackIndex].undo();
        }
    }

    public redo(): void {
        if (this.canRedo()) {
            this._stack[this._stackIndex].redo();
            this._stackIndex++;
        }
    }

    private _recorder: Recorder = new Recorder();

    public change(target: NotifyPropertyChanged, changeFunction: (target: NotifyPropertyChanged) => string): void {
        this.beginChange(target);
        let descrition = changeFunction(target);
        this.endChange(descrition);
    }

    public beginChange(target: NotifyPropertyChanged): void {
        this._recorder.begin(target);
    }

    public endChange(description: string): void {
        let result = this._recorder.end(description);
        if (result) {
            this.add(result);
        }
    }

}