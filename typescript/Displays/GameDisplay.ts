abstract class GameDisplay {
    public readonly clip : ProjectItem;
    public readonly ox : number;
    public readonly oy : number;
    public readonly width : number;
    public readonly height : number;

    constructor(clip : ProjectItem, ox : number, oy : number, width : number, height : number) {
        this.clip = clip;
        this.ox = ox;
        this.oy = oy;
        this.width = width;
        this.height = height;
    }

    protected abstract getOverallWidth() : number;
    protected abstract getOverallHeight() : number;

    public createSequence(destination : ProjectItem) : Sequence {
        let newSequence = app.project.createNewSequenceFromClips(this.clip.name, [this.clip], destination);
        let settings = newSequence.getSettings();
        settings.videoFrameWidth = this.width;
        settings.videoFrameHeight = this.height
        newSequence.setSettings(settings);

        let anchorPoint = findComponentProperty(newSequence.videoTracks[0].clips[0], "Motion", "Anchor Point");
        anchorPoint.setValue([(this.ox + this.width / 2) / this.getOverallWidth(), (this.oy + this.height / 2) / this.getOverallHeight()]);

        return newSequence;
    }
}