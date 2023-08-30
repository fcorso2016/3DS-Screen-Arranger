class N3DSScreens extends DualScreens {

    constructor(gameplay : ProjectItem, background : ProjectItem) {
        // TODO: Allow this to be more dynamic
        super(1920, 1080, background);
        this.topScreen = new N3DSDisplay(gameplay, 0, 0, 400, 240);
        this.bottomScreen = new N3DSDisplay(gameplay, 400, 0, 320, 240);
    }

    createSequences(screensBin : ProjectItem, outputBin : ProjectItem) : Array<Sequence> {
        let ret : Array<Sequence> = [];


        let topScreenBin = screensBin.createBin("TopScreen");
        let bottomScreenBin = screensBin.createBin("BottomScreen");
        let topScreenOnlyBin = outputBin.createBin("TopScreenOnly");
        let bottomScreenOnlyBin = outputBin.createBin("BottomScreenOnly");
        let reducedLowerScreenBin = outputBin.createBin("ReducedLowerScreen");
        let stackedScreensBin = outputBin.createBin("StackedScreens");

        let topScreenSequence = this.topScreen.createSequence(topScreenBin);
        let bottomScreenSequence = this.bottomScreen.createSequence(bottomScreenBin);

        ret.push(this.createSingleScreenSequence(topScreenSequence, topScreenOnlyBin));
        ret.push(this.createSingleScreenSequence(bottomScreenSequence, bottomScreenOnlyBin));

        ret.push(this.createTwoScreenSequence(new ScreenClip(topScreenSequence.projectItem, 640, 384, 320),
            new ScreenClip(bottomScreenSequence.projectItem, 1600, 840, 200), background, reducedLowerScreenBin));
        ret.push(this.createTwoScreenSequence(new ScreenClip(topScreenSequence.projectItem, 960, 270, 225),
            new ScreenClip(bottomScreenSequence.projectItem, 960, 810, 225), background, stackedScreensBin));

        return ret;
    }

}