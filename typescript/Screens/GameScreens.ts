abstract class GameScreens {
    public readonly screenWidth : number;
    public readonly screenHeight : number;
    public readonly background : ProjectItem;

    constructor(screenWidth : number, screenHeight : number, background : ProjectItem) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.background = background;
    }

    abstract createSequences(screensBin : ProjectItem, outputBin : ProjectItem) : Array<Sequence>;
}