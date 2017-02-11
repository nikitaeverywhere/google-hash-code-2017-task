const fs = require("fs");
const Layers = require("./app/layers.js");
const Solution = require("./app/slicer.js");
const INPUT_FILE = process.argv[2];
const OUTPUT_FILE = process.argv[2].replace(/^.*\//, "");

console.log(`Parsing ${ INPUT_FILE } file...`);

let time = Date.now();

const fileData = fs.readFileSync(INPUT_FILE).toString(),
      rows = fileData.split(/\r?\n/g),
      input = rows[0].split(/\s/g);

rows.splice(0, 1);
rows.splice(rows.length - 1, 1);

const data = rows.map(d => d.split("").map(e => e === "T"));
const MIN_INGREDIENTS = +input[2];
const MAX_CELLS = +input[3];

console.log(`Data read and parsed in ${ -time + (time = Date.now()) }ms`);

let layers = Layers.getLayers(data, MIN_INGREDIENTS, MAX_CELLS);

// fs.writeFileSync("./debug.test", JSON.stringify(layers, null, 4));

console.log(`Layers computed in ${ -time + (time = Date.now()) }ms`);

let max = 0,
    min = Infinity,
    mins = [];

for (let i = 0; i < layers.length; i++) {
    for (let j = 0; j < layers[i].length; j++) {
        if (layers[i][j].length < min && layers[i][j].length !== 0) {
            if (layers[i][j].length !== min) // but less
                mins = [];
            min = layers[i][j].length;
            mins.push([i, j]); // remember rows and cols
        }
        if (layers[i][j].length > max) {
            max = layers[i][j].length;
        }
    }
}

console.log(`Maximum number of layers: ${ max }, min variant pieces (except 0): ${ mins.length }`);

let html = `<html><head><style>body{font-family: monospace;}div{white-space: nowrap}span{display: inline-block}</style></head><body style="margin:0;padding:0">
<table style="border-collapse: collapse; table-layout: fixed;">` + layers.map(r => "<div>" + r.map(c => {
        const l = c.length;
        return `<span style='color:rgb(${ Math.round(255 * l / max) },0,0);
background-color:rgb(0,${ Math.round(256 - 128 * l / max) },0)'>` + ("00" + l.toString()).substr(-3) + "</span>"
    }).join("") + "</div>").join("") + `</table></body></html>`;

fs.writeFileSync(`./${ OUTPUT_FILE }.html`, html);

console.log(`Output html file saved in ${ -time + (time = Date.now()) }ms`);

let minimal = mins[Math.floor(Math.random() * mins.length)]; // start from the random minimal point
let solution = Solution.findPerfectSlices(
    data,
    layers,
    minimal[0],
    minimal[1]
);

console.log(`Solution found in ${ -time + (time = Date.now()) }ms`);
console.log(`\x1b[32mSolution score: ${
    solution.map(s => (Math.abs(s[2] - s[0]) + 1) * (Math.abs(s[3] - s[1]) + 1))
        .reduce((a, b) => a + b)
}/${ layers.length * layers[0].length }\x1b[0m`);

fs.writeFileSync(
    `./${ OUTPUT_FILE }.out`,
    solution.length + `\n` + solution.map(s => s.join(` `)).join(`\n`)
);