// @include "Displays/GameDisplay.js"
// @include "Displays/N3DSDisplay.js"

// @include "Screens/GameScreens.js"
// @include "Screens/DualScreens.js"
// @include "Screens/N3DSScreens.js"

// @include "Utils/Common.js"
// @include "Utils/ScreenClip.js"
// @include "Utils/N3DSScreenBins.js"

var targetBin = getItem("GameplayFootage", "Pokémon Super Mystery Dungeon", "Raw");
var background = getItem("GameplayFootage", "Pokémon Super Mystery Dungeon", "Mystery_Dungeon_World_PSMD.png");
var outputLocation = getItem("GameplayFootage", "Pokémon Super Mystery Dungeon");
main(targetBin, background, outputLocation, "Edited")

function main(targetBin : ProjectItem, background : ProjectItem, outputLocation : ProjectItem, outputName : string) {
    let newBin = outputLocation.createBin(outputName)
    let screensBin = newBin.createBin("Screens");
    let outputBin = newBin.createBin("Displays");
    let bins = new N3DSScreenBins(screensBin, outputBin);

    for (let i: number = 0; i < targetBin.children.numItems; i++) {
        let child = targetBin.children[i];
        let screens = new N3DSScreens(child, background);
        screens.createSequences(bins);
    }

    alert("Sequences Created!");
}