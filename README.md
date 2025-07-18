# Chrome Roadmap.sh Extension
A Google Chrome Extension that changes the looks of roadmap.sh to real dark mode and that marks completed items green and in progress items orange.













i found out how to fix it
```html
<g data-node-id="ezdqQW9wTUw93F6kjOzku" data-type="i-removed-this" data-title="Version Control Systems" data-parent-id="2f0ZO6GJElfZ2Eis28Hzg" data-parent-title="Pick a Language" class="r" style="
    background-color: red !important;
"><rect x="-268.73230823147514" y="309.03763825035634" width="229.3" height="46.3" rx="5" fill="red" stroke="red" stroke-width="2.7" style="--hover-color: #00000"></rect><text x="-154.08230823147517" y="334.3376382503563" text-anchor="middle" dominant-baseline="middle" font-size="17" fill="#000000"><tspan>Version Control Systems</tspan></text></g>
```
these changes make it red with white text

some changes were probably not necessary



now make it orange when the class is learning


#### this might also have caused it (but i injected)

```
vg g[data-type="topic"] rect, svg g[data-type="subtopic"] rect {
    fill: rgb(58, 58, 58) !important;
    stroke: rgb(106, 106, 106) !important;
    stroke-width: 2.7 !important;
}
```

#### i found how to do it!

for all learning classes items

do this but then orange for these items
```
<rect x="65.54732720359934" y="-16.94269649784797" width="275.3" height="46.3" rx="5" fill="#ffe599" stroke="black" stroke-width="2.7" style="/* --hover-color: #f3c950; */fill: red !important;"></rect>
```

using fill and important
