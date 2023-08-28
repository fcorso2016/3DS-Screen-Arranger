class SourceClip {
    private readonly clip : ProjectItem;

    constructor(file : ProjectItem) {
        if (file.type != ProjectItemType.FILE && file.type != ProjectItemType.CLIP) {
            throw new Error("Cannot create a source clip from something that is not a file")
        }

        this.clip = file;
    }

    public getClip() : ProjectItem {
        return this.clip;
    }
}