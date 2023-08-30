class ScreenClip {
    public readonly screen : ProjectItem;
    public readonly x : number;
    public readonly y : number;
    public readonly scale : number;

    constructor(screen : ProjectItem, x : number, y : number, scale : number) {
        this.screen = screen;
        this.x = x;
        this.y = y;
        this.scale = scale;
    }

    public positionAndScale(clip : TrackItem, sequence : Sequence) : void {
        let position = findComponentProperty(clip, "Motion", "Position");
        position.setValue([this.x / sequence.frameSizeHorizontal, this.y / sequence.frameSizeVertical]);

        let screenScale = findComponentProperty(clip, "Motion", "Scale");
        screenScale.setValue(this.scale);
    }
}