---
layout: "../../layouts/BlogPost.astro"
title: "Mac screen capture to gif"
description: "Steps to make a gif from a screen capture on Mac"
pubDate: "July 26 2023"
---

Capture the Screen Recording:

Press Command + Shift + 5 to open the screenshot and screen recording tool.
In the toolbar that appears, click on "Record Entire Screen" or "Record Selected Portion" depending on what you want to capture.


Record your screen:

If you chose "Record Entire Screen," click anywhere on your screen to start the recording.
If you chose "Record Selected Portion," drag to select the area you want to record and then click the "Record" button.


Stop the recording:

Once you have captured the desired screen actions, click the "Stop" button in the menu bar (it looks like a square).

You can crop using the bar on the top and then press done there. It will save your .mov file to the Desktop.

Run

```
ffmpeg -i <your_.mov_here> -pix_fmt rgb8 -r 10 output.gif && gifsicle -O3 output.gif -o output.gif
```

Reference:
https://gist.github.com/SheldonWangRJT/8d3f44a35c8d1386a396b9b49b43c385
