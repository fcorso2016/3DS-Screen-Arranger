class SequenceCreator {
    source : SourceClips;
    templateName : string;

    constructor(src : SourceClips, template : string) {
        this.source = src;
        this.templateName = template;
    }

    createProject(dest : ProjectItem) : void {
        let folder = dest.createBin(this.templateName);

        let sourceClips = this.source.getSourceClips();
        for (const element of sourceClips) {
            let clip = element.getClip();
            let newSequence = app.project.createNewSequenceFromClips(clip.name, [clip], folder);
        }
    }
}