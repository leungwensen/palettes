#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');

function cleanName(name) {
  name = name.replace(/\-/g, '');
  name = name.replace(/\s/g, '');
  name = name.replace('Diverging', '')
  name = name.replace('Sequential', '');
  name = name.replace('10', '');
  name = name.replace('20', '');
  return name;
}

const result = {};
const names = [];
try {
  const doc = yaml.safeLoad(fs.readFileSync(path.resolve(__dirname, './tableau-new.yml'), 'utf8'));
  _.each(doc.palettes, (set, category) => {
    result[category] = {};
    _.each(set, (palette, name) => {
      const key = `${cleanName(name)}_${palette.length}`;
      result[category][key] = palette.map(color => color.value);
    });
  });
  console.log(result);
} catch (e) {
  console.log(e);
}
