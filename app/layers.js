const T = true;
const M = false;

module.exports.getLayers = function (data = [[]], MIN_TYPES = 1, MAX_CELLS = 14) {
    const rows = data.length,
          cols = data[0].length;
    let variants = data.map(row => row.map(c => []));
    for (let r = 0; r < rows; ++r) {
        process.stdout.write(`\r${Math.round(r / rows * 10000) / 100}%`);
        for (let c = 0; c < cols; ++c) {
            let tow = Math.min(MAX_CELLS, cols - c),
                toh = Math.min(MAX_CELLS, rows - r);
            //console.error(c, r, "|", toi, toj);
            for (let w = 1; w <= tow; w++) { // cols
                for (let h = 1; h <= toh; h++) { // rows
                    if (w * h > MAX_CELLS || w * h < MIN_TYPES * 2) continue;
                    let t = 0,
                        m = 0;
                    for (let ii = 0; ii < w; ii++) {
                        for (let jj = 0; jj < h; jj++) {
                            if (data[r + jj][c + ii] === true) ++t; else ++m;
                            // n += data[r + jj][c + ii];
                        }
                    }
                    if (t >= MIN_TYPES && m >= MIN_TYPES) {
                        let variant = [true, r, c, w, h];
                        for (let ii = 0; ii < w; ii++) {
                            for (let jj = 0; jj < h; jj++) {
                                variants[r + jj][c + ii].push(variant);
                            }
                        }
                    }
                }
            }
        }
    }
    process.stdout.write("\r100%\n");
    return variants;
};