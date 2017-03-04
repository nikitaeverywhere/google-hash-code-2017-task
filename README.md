# Google Hash Code 2017 Pizza Task 

This is the solution for [Google Hash Code 2017](https://hashcode.withgoogle.com) practice task. The PDF with problem statement: [/pizza.pdf](https://github.com/ZitRos/google-hash-code-2017-task/blob/master/pizza.pdf).

### Algorithm

The algorithm to solve this task is following:

1. Find all possible variants for each cell of the pizza. This will form 3-dimensional array `[x][y][variant]` with each value of available slice to cut `[x, y, width, height]`.
2. Starting from the random cell in pizza (preferably picked up from ones which have the minimum variants available), find the slice of all available slices for this cell which has the minimum [weight](https://github.com/ZitRos/google-hash-code-2017-task/blob/da8916d289f832d084b27805885adad85b532a4f/app/slicer.js#L122). In short, the weight function calculates the number, which reflects the importance of the slice we are going to cut out. The most important slices are those ones which leave less available variants around the slice than others after being cut. The more slice is important, the bigger weight it has.
3. Once the slice is cut, remove all its variants from variants array (this will also remove some of the variants from adjacent cells).
4. Continue cutting slices until all the variants are processed.

### How to Run

You need [Git](https://git-scm.com) and [NodeJS v6+](https://nodejs.org/uk/) installed to be in. After cloning the project with the next commands:

```bash
git clone https://github.com/ZitRos/google-hash-code-2017-task.git
cd google-hash-code-2017-task
```

Execute the Node program on [input files](https://github.com/ZitRos/google-hash-code-2017-task/tree/master/input) with the following command:

```bash
node index input/small.in
```

The last command-line parameter is the file name to process. The output will go to the `output` directory.

### Example

Running slicer on the medium dataset.

```bash
Parsing input/medium.in file...
Data read and parsed in 99ms
100%
Layers computed in 1947ms
Maximum number of layers: 182, min variant pieces (except 0): 1
Output html file saved in 107ms
100%
Solution found in 14651ms
Solution score: 48077/50000
```

The results may vary each time as algorithm features randomization.
