class SequenceBuilder {
    private static instance : SequenceBuilder;
    private clips : SourceClips;

    private constructor() {
    }

    public static getInstance() : SequenceBuilder {
        if (SequenceBuilder.instance == null)
            SequenceBuilder.instance = new SequenceBuilder();

        return SequenceBuilder.instance;
    }

    public setSourceBin() : string {
        let viewId = app.getProjectViewIDs()[0];
        let selection = app.getProjectViewSelection(viewId);
        if (selection.length == 1) {
            this.clips = new SourceClips(selection[0]);
            return selection[0].name;
        }

        return "";
    }
}