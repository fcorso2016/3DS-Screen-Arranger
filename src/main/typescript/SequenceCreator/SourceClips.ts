class SourceClips {
    private sourceClips : Array<SourceClip>;

    constructor(root : ProjectItem) {
        if (root.type != ProjectItemType.BIN) {
            throw new Error("The root must be of type BIN in order to be processed")
        }

        for (var i : number = 0; i < root.children.numItems; i++) {
            this.sourceClips.push(new SourceClip(root.children[i]))
        }
    }

    public getSourceClips() : Array<SourceClip> {
        return this.sourceClips;
    }
}