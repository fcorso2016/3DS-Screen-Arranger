class N3DSScreens extends DualScreens {

    constructor(gameplay : ProjectItem, background : ProjectItem) {
        // TODO: Allow this to be more dynamic
        super(1920, 1080, background);
        this.topScreen = new N3DSDisplay(gameplay, 0, 0, 400, 240);
        this.bottomScreen = new N3DSDisplay(gameplay, 400, 0, 320, 240);
    }

    createSequences(screenBins : ScreenBins) : Array<Sequence> {
        let N3DS = screenBins as N3DSScreenBins;

        let ret : Array<Sequence> = [];

        let topScreenSequence = this.topScreen.createSequence(N3DS.topScreenBin);
        let bottomScreenSequence = this.bottomScreen.createSequence(N3DS.bottomScreenBin);

        ret.push(this.createSingleScreenSequence(topScreenSequence, N3DS.topScreenOnlyBin));
        ret.push(this.createSingleScreenSequence(bottomScreenSequence, N3DS.bottomScreenOnlyBin));

        ret.push(this.createTwoScreenSequence(new ScreenClip(topScreenSequence.projectItem, 640, 384, 320),
            new ScreenClip(bottomScreenSequence.projectItem, 1600, 840, 200), N3DS.reducedLowerScreenBin));
        ret.push(this.createTwoScreenSequence(new ScreenClip(topScreenSequence.projectItem, 960, 270, 225),
            new ScreenClip(bottomScreenSequence.projectItem, 960, 810, 225), N3DS.stackedScreensBin));

        return ret;
    }

}