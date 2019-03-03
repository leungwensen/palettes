
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