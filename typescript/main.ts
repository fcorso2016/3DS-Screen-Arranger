function setSourceDirectory() : void {
    let csInterface = new CSInterface();
    document.getElementById("selectionError").innerHTML = "It's doing something?";
    csInterface.evalScript("setSourceBin()", function(result) {
        (<HTMLInputElement>document.getElementById("selectedSourceBin")).value = result;
        document.getElementById("selectionError").innerHTML = result;
    });

    try {

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