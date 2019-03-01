
// namespace
require('./css/index.css');
const palettes = require('./palettes');
const $ = require('jquery');
const dat = require('dat.gui');
const Plotly = require('plotly.js');
const chroma = require('chroma-js');
const _ = require('lodash');
const Picker = require('vanilla-picker');

// preset palettes
const palettesContainerSelector = '#palettes-container';
const $palettesContainer = $(palettesContainerSelector);

_.each(palettes, (palette, name) => {
    const sectionId = _.toLower(name);
    // const show = (name === 'ColorBrewer2');
    const show = false;
    const $card = $('<div class="card"></div>');
    const $header = $(`<div class="card-header">
      <h3 class="mb-0">
        <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#${sectionId}">
            ${name}
        </button>
      </h3>
    </div>`);
    $card.append($header);
    const $body = $(`<div id="${sectionId}" class="collapse${show ? ' show' : ''}" data-parent="${palettesContainerSelector}">
      <div class="card-body">
      </div>
    </div>`);
    $card.append($body);
    const $cardBody = $body.find('.card-body');
    _.each(palette, (value, key) => {
        $cardBody.append(`<h4>${key}</h4>`);
        if (_.isArray(value)) {
            $cardBody.append(`<table>
              <tr>
                ${value.map(item => `<td style="background: ${item};">${item}</td>`).join('')}
              </tr>
            </table>`);
        } else if (_.isPlainObject(value)) {
            _.each(value, (v, k) => {
                $cardBody.append(`<h5>${k}</h5>`);
                $cardBody.append(`<table>
                  <tr>
                    ${v.map(item => `<td style="background: ${item};">${item}</td>`).join('')}
                  </tr>
                </table>`);
            });
        }
    });
    $palettesContainer.append($card);
});

// color picker
$colorPickerContainer = $('#color-picker-container');
const picker = new Picker({
    parent: $colorPickerContainer[0],
    popup: false,
    editor: true,
});

// palette 3d view
const $dotSize = $('#3d-scatter-dot-size');
const palette = palettes.ColorBrewer2.diverging.BrBG_10; // hex string
let colorSpace = 'rgb';
function draw3dScatter() {
    const x = [];
    const y = [];
    const z = [];
    _.each(palette, color => {
        let components = [];
        switch (colorSpace) {
            case 'hsv':
                components = chroma(color).hsv();
                break;
            case 'hsl':
                components = chroma(color).hsl();
                break;
            case 'lab':
                components = chroma(color).lab();
                break;
            default:
                components = chroma(color).rgb();
                break;
        }
        x.push(components[0]);
        y.push(components[1]);
        z.push(components[2]);
    });

    const trace = {
        x: x,
        y: y,
        z: z,
        mode: 'markers',
        type: 'scatter3d',
        name: 'Colors',
        marker: {
            size: $dotSize.val(),
            color: palette
        }
    };
    const data = [trace];
    const layout = {
        scene: {
            camera: {
                eye: {x: 0.001, y: -2, z: 1},
                center: {x: 0, y: 0, z: 0}
            }
        },
        margin: {
            l: 0,
            r: 0,
            t: 0,
            b: 0,
            pad: 0
        }
    };
    if (colorSpace === 'rgb') {
        layout.scene.xaxis = {title: 'R', range: [0, 255]};
        layout.scene.yaxis = {title: 'G', range: [0, 255]};
        layout.scene.zaxis = {title: 'B', range: [0, 255]};
    } else if (colorSpace === 'hsv') {
        layout.scene.xaxis = {title: 'H', range: [0, 360]};
        layout.scene.yaxis = {title: 'S', range: [0, 100]};
        layout.scene.zaxis = {title: 'V', range: [0, 100]};
    } else if (colorSpace === 'hsl') {
        layout.scene.xaxis = {title: 'H', range: [0, 360]};
        layout.scene.yaxis = {title: 'S', range: [0, 100]};
        layout.scene.zaxis = {title: 'L', range: [0, 100]};
    } else if (colorSpace === 'lab') {
        layout.scene.xaxis = {title: 'L*', range: [0, 100]};
        layout.scene.yaxis = {title: 'a*', range: [-86.185, 98.254]};
        layout.scene.zaxis = {title: 'b*', range: [-107.863, 94.482]};
    }
    Plotly.purge('3d-scatter');
    Plotly.newPlot('3d-scatter', data, layout, {
        displayModeBar: false
    });
}
draw3dScatter();
$('input[name=color-space]').click(function() {
    const newColorSpace = $(this).val();
    if (colorSpace !== newColorSpace) {
        colorSpace = newColorSpace;
        draw3dScatter();
    }
});
$dotSize.on('input', () => {
    Plotly.restyle('3d-scatter', {
        'marker.size': $dotSize.val(),
    });
});
