let targetBin = getItem("GameplayFootage", "Pokémon Moon", "Raw");
let background = getItem("Graphics", "Alola_artwork.png");
let outputLocation = getItem("GameplayFootage", "Pokémon Moon")
main(targetBin, background, outputLocation, "Screens")

function getItem(...paths : string[]) : ProjectItem {
    let item = app.project.rootItem;
    for (const element of paths) {
        let found = false;
        for (let i = 0; i < item.children.numItems; i++) {
            if (item.children[i].name == element) {
                found = true;
                item = item.children[i];
                break;
            }
        }

        if (!found)
            return null;
    }

    return item;
}

function findComponentProperty(clip : TrackItem, componentName : string, propertyName : string) : ComponentParam {
    for (let i = 0; i < clip.components.numItems; i++) {
        let comp : Component  = clip.components[i];
        if (comp.displayName != componentName)
            continue;

        for (let j = 0; j < comp.properties.numItems; j++) {
            let prop = comp.properties[j];
            if (prop.displayName == propertyName)
                return prop;
        }
    }

    return null;
}

function createTopScreenSequence(clip : ProjectItem, destination : ProjectItem) : Sequence {
    let newSequence = app.project.createNewSequenceFromClips(clip.name, [clip], destination);
    let settings = newSequence.getSettings();
    settings.videoFrameWidth = 400;
    newSequence.setSettings(settings);

    let anchorPoint = findComponentProperty(newSequence.videoTracks[0].clips[0], "Motion", "Anchor Point");
    anchorPoint.setValue([200 / 720, 0.5]);

    return newSequence;
}

function createBottomScreenSequence(clip : ProjectItem, destination : ProjectItem) : Sequence {
    let newSequence = app.project.createNewSequenceFromClips(clip.name, [clip], destination);
    let settings = newSequence.getSettings();
    settings.videoFrameWidth = 320;
    newSequence.setSettings(settings);

    let anchorPoint = findComponentProperty(newSequence.videoTracks[0].clips[0], "Motion", "Anchor Point");
    anchorPoint.setValue([(400 + 160) / 720, 0.5]);

    return newSequence;
}

function calculateBackgroundScale(background : ProjectItem, sequence : Sequence) : number {
    // This is a hack but it gets me where I need to go
    let deleteBin = app.project.rootItem.createBin("DeleteMe");
    let dummySequence = app.project.createNewSequenceFromClips(background.name, [background], deleteBin);
    let width = dummySequence.frameSizeHorizontal;
    let height = dummySequence.frameSizeVertical;
    deleteBin.deleteBin();

    let widthScale = sequence.frameSizeHorizontal / width;
    let heightScale = sequence.frameSizeVertical / height;

    if (widthScale < 1 && heightScale < 1)
        return Math.min(widthScale, heightScale) * 100;
    else
        return Math.max(widthScale, heightScale) * 100;
}

function applyEffect(effect : string) {
    if(app.project.activeSequence == null) {
        alert("Please select a sequence first");
        return false;
    }

    let qeSequence = qe.project.getActiveSequence(0);
    let sequence = app.project.activeSequence;
    let videoTracks = sequence.videoTracks;

    let thisQETrack, thisVanillaClip;
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

function getVanillaClip(qeClip, trackIndex) {
    for(var c = 0; c < app.project.activeSequence.videoTracks[trackIndex].clips.numItems; c++) {
        if(app.project.activeSequence.videoTracks[trackIndex].clips[c].name == qeClip.name && ((app.project.activeSequence.videoTracks[trackIndex].clips[c].end.seconds - app.project.activeSequence.videoTracks[trackIndex].clips[c].start.seconds).toFixed(2) == (qeClip.end.secs - qeClip.start.secs).toFixed(2))) {
            return app.project.activeSequence.videoTracks[trackIndex].clips[c];
        }
    }
}

function createInitialSequence(screen : ProjectItem, background : ProjectItem, destination : ProjectItem) {
    let newSequence = app.project.createNewSequenceFromClips(screen.name, [screen], destination);
    let settings = newSequence.getSettings();
    settings.videoFrameWidth = 1920;
    settings.videoFrameHeight = 1080;
    newSequence.setSettings(settings);

    newSequence.videoTracks[0].clips[0].remove(false, false);
    newSequence.audioTracks[0].clips[0].remove(false, false);
    newSequence.insertClip(background, newSequence.getInPointAsTime(), 0, 0);

    return newSequence;
}

function scaleBackground(clip : TrackItem, background : ProjectItem, sequence : Sequence) {
    let backgroundScale = findComponentProperty(clip, "Motion", "Scale");
    backgroundScale.setValue(calculateBackgroundScale(background, sequence));
    applyEffect("Camera Blur");
}

function createSingleScreenSequence(screen : ProjectItem, background : ProjectItem, destination : ProjectItem) : Sequence {
    let newSequence = createInitialSequence(screen, background, destination);
    newSequence.insertClip(screen, newSequence.getInPointAsTime(), 1, 0);

    let backClip = newSequence.videoTracks[0].clips[0];
    let screenClip = newSequence.videoTracks[1].clips[0];
    backClip.end = screenClip.end;

    let screenScale = findComponentProperty(screenClip, "Motion", "Scale");
    screenScale.setValue(450);
    scaleBackground(backClip, background, newSequence);

    return newSequence;
}

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

function createTwoScreenSequence(topScreen : ScreenClip, bottomScreen : ScreenClip, background : ProjectItem, destination : ProjectItem) : Sequence {
    let newSequence = createInitialSequence(topScreen.screen, background, destination);
    newSequence.insertClip(topScreen.screen, newSequence.getInPointAsTime(), 2, 0);
    newSequence.audioTracks[0].clips[0].remove(false, false);
    newSequence.insertClip(bottomScreen.screen, newSequence.getInPointAsTime(), 1, 0);

    let backClip = newSequence.videoTracks[0].clips[0];
    let topScreenClip = newSequence.videoTracks[2].clips[0];
    let bottomScreenClip = newSequence.videoTracks[1].clips[0];
    backClip.end = topScreenClip.end;

    topScreen.positionAndScale(topScreenClip, newSequence);
    bottomScreen.positionAndScale(bottomScreenClip, newSequence);
    scaleBackground(backClip, background, newSequence);

    return newSequence;
}

function main(targetBin : ProjectItem, background : ProjectItem, outputLocation : ProjectItem, outputName : string) {
    let newBin = outputLocation.createBin(outputName)

    let screensBin = newBin.createBin("Screens");
    let topScreenBin = screensBin.createBin("TopScreen");
    let bottomScreenBin = screensBin.createBin("BottomScreen");

    let outputBin = newBin.createBin("Displays");
    let topScreenOnlyBin = outputBin.createBin("TopScreenOnly");
    let bottomScreenOnlyBin = outputBin.createBin("BottomScreenOnly");
    let reducedLowerScreenBin = outputBin.createBin("ReducedLowerScreen");
    let stackedScreensBin = outputBin.createBin("StackedScreens");

    for (let i: number = 0; i < targetBin.children.numItems; i++) {
        let child = targetBin.children[i];
        let topScreenSequence = createTopScreenSequence(child, topScreenBin).projectItem;
        let bottomScreenSequence = createBottomScreenSequence(child, bottomScreenBin).projectItem;

        createSingleScreenSequence(topScreenSequence, background, topScreenOnlyBin);
        createSingleScreenSequence(bottomScreenSequence, background, bottomScreenOnlyBin);

        createTwoScreenSequence(new ScreenClip(topScreenSequence, 640, 384, 320),
            new ScreenClip(bottomScreenSequence, 1600, 840, 200), background, reducedLowerScreenBin);
        createTwoScreenSequence(new ScreenClip(topScreenSequence, 960, 270, 225),
            new ScreenClip(bottomScreenSequence, 960, 810, 225), background, stackedScreensBin);
    }

    alert("Sequences Created!");
}