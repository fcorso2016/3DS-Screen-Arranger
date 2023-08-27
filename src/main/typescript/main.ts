let clips : SourceClips;

function selectCurrentBin() : void {
    try {
        let viewId = app.getProjectViewIDs()[0];
        let selection = app.getProjectViewSelection(viewId);
        if (selection.length == 1) {
            clips = new SourceClips(selection[0]);
            // @ts-ignore
            document.getElementById("selectedSourceBin").value = selection[0].name;
        }
    } catch (e) {
        // TODO: Log the error out
    }
}