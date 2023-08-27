class SequenceCreator {
    source : SourceClips;
    templateName : string;

    constructor(src : SourceClips, template : string) {
        this.source = src;
        this.templateName = template;
    }

    createProject(dest : ProjectItem) : void {
        var folder = dest.createBin(this.templateName);
        
        var sourceClips = this.source.getSourceClips();
        for (var i : number = 0; i < sourceClips.length; i++) {
            var clip = sourceClips[i].getClip();
            var newSequence = app.project.createNewSequenceFromClips(clip.name, [clip], folder);
        }
    }
}