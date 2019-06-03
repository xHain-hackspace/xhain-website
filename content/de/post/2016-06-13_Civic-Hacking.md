---
title: "Civic Hacking"
slug: ""
thumbnailImage: /img/civic.jpg
heroImage: /img/civic.jpg
heroCaption: "Jace Grandinetti via [Unsplash](https://unsplash.com/photos/nuOdDlVCpDU) ([CC0](https://creativecommons.org/publicdomain/zero/1.0/deed.de))"
date: 2016-06-13
categories:
- news
- events
tags:
- xhain
- events
keywords:
- xhain
type: blog
aliases:
- /de/2016/06/Civic-Hacking
---

Es geht darum, den ganzen Parlamentsbetrieb ordentlich aufzubereiten. Konkret geht es um 6000 Vorgänge aus der BVV Xhain (Anträge, Resolutionen, Anfragen etc). Diese liegen im Ratsinformationssystem ALLRIS vor [1]. Das ALLRIS ist aber nicht besonders toll. Ziel ist, die ganzen Sachen aufzubereiten, zu kategorisieren ("Bauausschuss", "SPD", "abgelehnt" etc), zu geotaggen und dann auf einer Karte erfassbar zu machen.

<!--more-->
Einen Dummy gibt es hier [2]

Die 6000 Datensätze liegen in dreckigem XHTML vor und müssen in ein vernünftiges Format transformiert werden (XML oder JSON, optional RDF falls jemand möchte).

Die Aufbereitung läuft derzeit durch Stringmatching. Machine Learning ist auch denkbar, aber wahrscheinlich nicht notwendig, da das relevante Vokabular ("Bauausschuss", "Sportausschuss", "Gesundheitsausschuss", ...) begrenzt und bekannt ist.

Bei der Aufbereitung ist Python als Sprache ziemlich gesetzt. Bei Backend und Frontend ist noch alles möglich. Derzeit läuft alles über AJAX und statisches JSON, das auf github.io liegt.

Alternative Projekte zu anderen Bezirken, Kommunen etc, sind gerne gesehen, ebenso alles, was mit Open Government Data zu tun hat.

Das dies ein Projekt ist, das nicht an einem Abend fertig wird, findet es jetzt an jedem 2.Dienstag im Monat ab 20:30 Uhr statt.

[1] http://www.berlin.de/ba-friedrichshain-kreuzberg/politik-und-verwaltung/bezirksverordnetenversammlung/online/vo040.asp

[2] http://glottotopia.github.io/bvvscout/
