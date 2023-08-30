class N3DSDisplay extends GameDisplay {

    constructor(clip : ProjectItem, ox : number, oy : number, width : number, height : number) {
        super(clip, ox, oy, width, height);
    }

    protected getOverallHeight(): number {
        return 720;
    }

    protected getOverallWidth(): number {
        return 240;
    }

}