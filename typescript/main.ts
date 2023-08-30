let targetBin = getItem("GameplayFootage", "Pokémon Moon", "Raw");
let background = getItem("Graphics", "Alola_artwork.png");
let outputLocation = getItem("GameplayFootage", "Pokémon Moon")
main(targetBin, background, outputLocation, "Screens")

function main(targetBin : ProjectItem, background : ProjectItem, outputLocation : ProjectItem, outputName : string) {
    let newBin = outputLocation.createBin(outputName)
    let screensBin = newBin.createBin("Screens");
    let outputBin = newBin.createBin("Displays");

    for (let i: number = 0; i < targetBin.children.numItems; i++) {
        let child = targetBin.children[i];
        let screens = new N3DSScreens(child, background);
        screens.createSequences(screensBin, outputBin);
    }

    alert("Sequences Created!");
}