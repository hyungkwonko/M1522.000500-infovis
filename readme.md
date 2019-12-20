# Musical Structure Visualization with MIDI Data

![](https://github.com/hyungkwonko/M1522.000500-infovis/blob/master/img/img1.png)

This project was done as a term project of information visualization class in Fall, 2019 by Hyung-Kwon Ko, Dongmoon Min, Seijun Chung, and Dantae An.

# What is this all about?

For visualizing the music, people have conventionally used the music sheet which consists of multiple sets of five lines (i.e., staves). However, the music sheet is unsuitable for analysis as it has unnecessary information which incurs visual clutters for users. The existing method is also difficult to understand for ordinary people who are not familiar with the musical representations (e.g., note). To resolve the challenges, this paper proposes a novel visualization system (see Fig. 1) which intuitively shows the target music's overall structure without visual clutters. The visualization is also easily understandable for untrained users. We expect that our system is useful for the users who want to get insight from music or who want to build ML networks for musical analysis.
![](https://github.com/hyungkwonko/M1522.000500-infovis/blob/master/img/img2.png)
![](https://github.com/hyungkwonko/M1522.000500-infovis/blob/master/img/img3.png)


# Web demo & video

You can find the web demo [here](https://hyungkwonko.github.io/M1522.000500-infovis-demo/), and the video [here](https://youtu.be/2h5kbOyopqg).


## Build

1. Clone this repository
   - `git clone https://github.com/hyungkwonko/M1522.000500-infovis.git`
2. Run with VSCODE
   - `cd M1522.000500-infovis`
   - `code .`
3. Install requirements
   - `npm install`
4. Run web server
   - `ng serve -o`