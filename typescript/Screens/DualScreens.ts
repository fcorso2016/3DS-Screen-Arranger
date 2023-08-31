abstract class DualScreens extends GameScreens {
    protected topScreen : GameDisplay;
    protected bottomScreen : GameDisplay;

    protected createSingleScreenSequence(screen : Sequence, destination : ProjectItem) : Sequence {
        let newSequence = this.createInitialSequence(screen.projectItem, destination);
        newSequence.insertClip(screen.projectItem, newSequence.getInPointAsTime(), 1, 0);

        let backClip = newSequence.videoTracks[0].clips[0];
        let screenClip = newSequence.videoTracks[1].clips[0];
        backClip.end = screenClip.end;

        let screenScale = findComponentProperty(screenClip, "Motion", "Scale");
        screenScale.setValue(this.calculateScreenScale(screen));
        this.scaleBackground(backClip, newSequence);

        return newSequence;
    }

    protected createTwoScreenSequence(topScreen : ScreenClip, bottomScreen : ScreenClip, destination : ProjectItem) : Sequence {
        let newSequence = this.createInitialSequence(topScreen.screen, destination);
        newSequence.insertClip(topScreen.screen, newSequence.getInPointAsTime(), 2, 0);
        newSequence.audioTracks[0].clips[0].remove(false, false);
        newSequence.insertClip(bottomScreen.screen, newSequence.getInPointAsTime(), 1, 0);

        let backClip = newSequence.videoTracks[0].clips[0];
        let topScreenClip = newSequence.videoTracks[2].clips[0];
        let bottomScreenClip = newSequence.videoTracks[1].clips[0];
        backClip.end = topScreenClip.end;

        topScreen.positionAndScale(topScreenClip, newSequence);
        bottomScreen.positionAndScale(bottomScreenClip, newSequence);
        this.scaleBackground(backClip, newSequence);

        return newSequence;
    }

    private createInitialSequence(screen : ProjectItem, destination : ProjectItem) {
        let newSequence = app.project.createNewSequenceFromClips(screen.name, [screen], destination);
        let settings = newSequence.getSettings();
        settings.videoFrameWidth = 1920;
        settings.videoFrameHeight = 1080;
        newSequence.setSettings(settings);

        newSequence.videoTracks[0].clips[0].remove(false, false);
        newSequence.audioTracks[0].clips[0].remove(false, false);
        newSequence.insertClip(this.background, newSequence.getInPointAsTime(), 0, 0);

        return newSequence;
    }

    private calculateScreenScale(screen : Sequence) : number {
        let widthScale = this.screenWidth / screen.frameSizeHorizontal;
        let heightScale = this.screenHeight / screen.frameSizeVertical;

        return Math.min(widthScale, heightScale) * 100;
    }

    private scaleBackground(clip : TrackItem, sequence : Sequence) {
        let backgroundScale = findComponentProperty(clip, "Motion", "Scale");
        backgroundScale.setValue(this.calculateBackgroundScale(this.background, sequence));
        this.applyEffect("Camera Blur");
    }

    private calculateBackgroundScale(background : ProjectItem, sequence : Sequence) : number {
        // This is a hack but it gets me where I need to go
        let deleteBin = app.project.rootItem.createBin("DeleteMe");
        let dummySequence = app.project.createNewSequenceFromClips(background.name, [background], deleteBin);
        let width = dummySequence.frameSizeHorizontal;
        let height = dummySequence.frameSizeVertical;
        deleteBin.deleteBin();

        let widthScale = sequence.frameSizeHorizontal / width;
        let heightScale = sequence.frameSizeVertical / height;


        return Math.max(widthScale, heightScale) * 100 + 15;
    }

    private applyEffect(effect : string) : void {
        let qeSequence = qe.project.getActiveSequence(0);
        let sequence = app.project.activeSequence;
        let videoTracks = sequence.videoTracks;

        let thisQETrack : any;
        let thisVanillaClip : TrackItem;
        for(let i = 0; i < videoTracks.numTracks; i++) {
            thisQETrack = qeSequence.getVideoTrackAt(i);
            for(let e = 0; e < thisQETrack.numItems; e++) {
                if(thisQETrack.getItemAt(e).type.toString() != "Empty") {
                    thisVanillaClip = getVanillaClip(thisQETrack.getItemAt(e), i);
                    if(thisVanillaClip != null) {
                        if(thisVanillaClip.isSelected()) {
                            thisQETrack.getItemAt(e).addVideoEffect(qe.project.getVideoEffectByName(effect));
                        }
                    }
                }
            }
        }
    }
}