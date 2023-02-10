main -> entry {% (d) => ({...d[0], duration: (d[0].end.hours * 60 + d[0].end.minutes) - (d[0].start.hours * 60 + d[0].start.minutes) - d[0].break}) %}
      | main "\n" main {% (d) => [d[0], d[2]].flat() %}

entry -> date " " time " " time " " break {% (d) => ({date: d[0], start: d[2], end: d[4], break: d[6]}) %}

break -> minutes {% (d) => d[0] %}
       | time {% (d) => d.hours * 60 + d.minutes %}
       | break " " break {% (d) => d[0] + d[2] %}

date -> year "-" month "-" day {% (d) => ({year: d[0], month: d[2], day: d[4]}) %}

year -> "20" [0-9] [0-9] {% (d) => parseInt(d.flat().join("")) %}

month -> "1" [0-2] {% (d) => parseInt(d.flat().join("")) %}
       | "0" [1-9] {% (d) => parseInt(d.flat().join("")) %}
       | [0-9]     {% (d) => parseInt(d.flat().join("")) %}

day -> [0-9] [0-9]  {% (d) => parseInt(d.flat().join("")) %}
     | [1-9]        {% (d) => parseInt(d.flat().join("")) %}

time -> [0-2] [0-9] ":" minutes {% (d) => ({hours: parseInt(d[0] + d[1]), minutes: d[3]}) %}

minutes -> [0-5] [0-9] {% (d) => parseInt(d.flat().join("")) %}