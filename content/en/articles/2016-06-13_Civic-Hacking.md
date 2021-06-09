---
title: "Civic Hacking"
slug: ""
image: /images/articles/civic.jpg
heroImage: /images/articles/civic.jpg
image_reference: "Jace Grandinetti via [Unsplash](https://unsplash.com/photos/nuOdDlVCpDU) ([CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.de))"
date: 2016-06-13
categories:
- news
- events
tags:
- xhain
- events
keywords:
- xhain
---

The idea is to recycle the whole Parliament operating process properly. Specifically, it is about 6000 operations of the BVV Xhain (requests, resolutions etc). You can find them in the council information system ALLRIS [1]. But the ALLRIS is not particularly great. The goal is to recycle all the stuff to categorize ( "planning committee", "SPD", "rejected" etc) to geotag, and then to make detectable on a map.

<!--more-->
You'll find a dummy here [2].

The 6000 data files are in dirty XHTML and must be transformed into a rational format (XML or JSON, RDF optional if someone wants).

The preparation is currently underway by string matching. Machine learning is also possible, but probably not necessary as the relevant vocabulary ( "planning committee", "Sport Committee", "Health Committee", ...) is limited and known.

When preparing Python is pretty set as language. In backend and frontend, everything is still possible. Currently everything runs on AJAX and JSON static lying on github.io.

Alternative projects to other districts, municipalities etc, are welcome, as everything has to do with open government data.

As this is a project that is not in one evening is finished, it will take place every second tuesday of a month from 8:30pm.


[1] http://www.berlin.de/ba-friedrichshain-kreuzberg/politik-und-verwaltung/bezirksverordnetenversammlung/online/vo040.asp

[2] http://glottotopia.github.io/bvvscout/
