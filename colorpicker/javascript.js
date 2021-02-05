// Javascript File


function hexGen() {
    // Array for HEX Code generation. Base 10 and upto F.
    const hexCodeArray = [0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F"];

    // Empty Array, used for returning output.
    hexCode = "#"

    // Generate 6 characters for uuid Array through For Loop.
    for (i = 0; i < 6; i++) {
        n = hexCodeArray[Math.floor(Math.random() * hexCodeArray.length)];
        hexCode += n;
    }
    // Input into field.
    document.getElementById("hex-field").value = hexCode;
};

function colorDisplay() {
    hexGen();
    // Find Div(hex-result) and set Background Color to Result Value.
    document.getElementById("hex-result").style.background = hexCode;
}

console.log(colorDisplay())