class N3DSScreenBins {
    public readonly topScreenBin : ProjectItem;
    public readonly bottomScreenBin : ProjectItem;
    public readonly topScreenOnlyBin : ProjectItem;
    public readonly bottomScreenOnlyBin : ProjectItem;
    public readonly reducedLowerScreenBin : ProjectItem;
    public readonly stackedScreensBin : ProjectItem;

    constructor(screensBin : ProjectItem, outputBin : ProjectItem) {
        this.topScreenBin = screensBin.createBin("TopScreen");
        this.bottomScreenBin = screensBin.createBin("BottomScreen");
        this.topScreenOnlyBin = outputBin.createBin("TopScreenOnly");
        this.bottomScreenOnlyBin = outputBin.createBin("BottomScreenOnly");
        this.reducedLowerScreenBin = outputBin.createBin("ReducedLowerScreen");
        this.stackedScreensBin = outputBin.createBin("StackedScreens");
    }
}