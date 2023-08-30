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

function getVanillaClip(qeClip : any, trackIndex : number) : TrackItem {
    for(let c = 0; c < app.project.activeSequence.videoTracks[trackIndex].clips.numItems; c++) {
        if(app.project.activeSequence.videoTracks[trackIndex].clips[c].name == qeClip.name && ((app.project.activeSequence.videoTracks[trackIndex].clips[c].end.seconds - app.project.activeSequence.videoTracks[trackIndex].clips[c].start.seconds).toFixed(2) == (qeClip.end.secs - qeClip.start.secs).toFixed(2))) {
            return app.project.activeSequence.videoTracks[trackIndex].clips[c];
        }
    }
}