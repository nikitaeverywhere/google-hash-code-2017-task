let layers, pizzaDone, toBeDone, solution, width, height, allPizza, allPos;

/**
 * @param {boolean[][]} data - Pizza! It is used here only to get it's dimensions.
 * @param {[boolean, number, number, number, number][][][]} lrs - Mutable array of all possible
 *                                                                layers for each cell of the pizza.
 * @param {number} r - Row to start cutting from
 * @param {number} c - Col to start cutting from
 */
module.exports.findPerfectSlices = function (data, lrs, r = 0, c = 0) {
    layers = lrs;
    pizzaDone = 0;
    solution = [];
    height = data.length;
    width = data[0].length;
    toBeDone = width * height;
    allPos = 0;
    allPizza = [];
    let bounds = [[r, c]],
        b = 0;
    while (b < bounds.length) {
        if (countVariants(bounds[b][0], bounds[b][1]) === 0) {
            bounds[b] = undefined;
            ++b;
            continue;
        }
        let bb = recurse(bounds[b][0], bounds[b][1]);
        for (let bbb of bb) {
            if (countVariants(bbb[0], bbb[1]) !== 0)
                bounds.push(bbb);
        }
        bounds[b] = undefined;
        ++b;
    }
    process.stdout.write(`\r100%\n`);
    return solution;
};

/**
 * Recurse over pizza to get the most yummy slices cut!
 * @param {number} row
 * @param {number} col
 */
function recurse (row, col) {
    let minWeight = Infinity,
        minSlices = [],
        j, vvv, bounds = [];
    for (let slice of layers[row][col]) {
        if (slice[0] === false) continue;
        let weight = getWeight(slice);
        // console.log(`Wight of (${slice[1]}, ${slice[2]}, ${slice[3]}, ${slice[4]}) is ${weight}.`);
        if (minWeight === weight) minSlices.push(slice);
        if (weight >= minWeight) continue;
        minWeight = weight;
        minSlices = [slice];
    }
    let slice = minSlices[Math.floor(minSlices.length * Math.random())]; // pick random
    cutSlice(slice); // say yummy!
    ++pizzaDone;
    // console.log(`Slice (${slice[1]}, ${slice[2]}, ${slice[3]}, ${slice[4]}) marked as cut.`);
    solution.push([slice[1], slice[2], slice[1] + slice[4] - 1, slice[2] + slice[3] - 1]);
    for (j = 0; j < slice[3] + 2; j++) {
        if ((vvv = countVariants(slice[1] - 1, slice[2] - 1 + j)) > 0) {
            bounds.push([slice[1] - 1, slice[2] - 1 + j]);
        }
        if ((vvv = countVariants(slice[1] + slice[4], slice[2] - 1 + j)) > 0) {
            bounds.push([slice[1] + slice[4], slice[2] - 1 + j]);
        }
    }
    for (j = 0; j < slice[4] + 2; j++) {
        if ((vvv = countVariants(slice[1] - 1 + j, slice[2] - 1)) > 0) {
            bounds.push([slice[1] - 1 + j, slice[2] - 1]);
        }
        if ((vvv = countVariants(slice[1] - 1 + j, slice[2] + slice[3])) > 0) {
            bounds.push([slice[1] - 1 + j, slice[2] + slice[3]]);
        }
    }
    return bounds;
}

/**
 * @param {[boolean, number, number, number, number]} slice - [cut, row, column, width, height]
 * @returns {[boolean, number, number, number, number][]} - all other slice vars cut from the pizza
 */
function cutSlice (slice) {
    let restore = [];
    for (let w = 0; w < slice[3]; w++) {
        for (let h = 0; h < slice[4]; h++) {
            for (let slc of layers[slice[1] + h][slice[2] + w]) {
                if (slc[0] === false)
                    continue;
                slc[0] = false;
                restore.push(slc);
            }
        }
    }
    return restore;
}

/**
 * Count the number of available variants by one slice.
 * @param {number} row
 * @param {number} col
 * @returns {number}
 */
function countVariants (row, col) {
    if (row < 0 || col < 0 || row >= height || col >= width)
        return 0;
    let v = 0;
    for (let layer of layers[row][col]) {
        if (layer[0] === true) ++v;
    }
    return v;
}

/**
 * Counts a relative weight (cost) of a slice. Slices having the minimal wight (cost) are the best
 * candidates to be cut.
 * @param {[boolean, number, number, number, number]} slice - [cut, row, column, width, height]
 * @returns {number}
 */
function getWeight (slice) {
    let w = 0,
        curr = 0, // current weight
        j;
    for (j = 0; j < slice[3] + 2; j++) {
        curr += countVariants(slice[1] - 1, slice[2] - 1 + j) || -1000;
        curr += countVariants(slice[1] + slice[4], slice[2] - 1 + j) || -1000;
    }
    for (j = 0; j < slice[4] + 2; j++) {
        curr += countVariants(slice[1] - 1 + j, slice[2] - 1) || -1000;
        curr += countVariants(slice[1] - 1 + j, slice[2] + slice[3]) || -1000;
    }
    let restore = cutSlice(slice);
    for (j = 0; j < slice[3] + 2; j++) {
        w += countVariants(slice[1] - 1, slice[2] - 1 + j) || -1000;
        w += countVariants(slice[1] + slice[4], slice[2] - 1 + j) || -1000;
    }
    for (j = 0; j < slice[4] + 2; j++) {
        w += countVariants(slice[1] - 1 + j, slice[2] - 1) || -1000;
        w += countVariants(slice[1] - 1 + j, slice[2] + slice[3]) || -1000;
    }
    for (let slice of restore) slice[0] = true; // restore slices
    return (curr - w) /*/ Math.sqrt(slice[3] * slice[4])*/; // adjust weight of a piece
}