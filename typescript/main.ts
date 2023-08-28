function setSourceDirectory() : void {
    let csInterface = new CSInterface();
    try {
        csInterface.evalScript("SequenceBuilder.getInstance().setSourceBin()", function(result) {
            (<HTMLInputElement>document.getElementById("selectedSourceBin")).value = result;
            document.getElementById("selectionError").innerHTML = "Value";
        });
    } catch (e) {
        document.getElementById("selectionError").innerHTML = e.message;
    }
}

function getOS() {
    let userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        os = null;

    if(macosPlatforms.indexOf(platform) != -1) {
        os = "MAC";
    } else if(windowsPlatforms.indexOf(platform) != -1) {
        os = "WIN";
    }
    return os;
}