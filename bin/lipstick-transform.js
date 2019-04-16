#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const lipstick = require('./lipstick.json');

const result = {};
const brands = lipstick.brands;

_.each(brands, (brand) => {
  result[brand.name] = {};
  _.each(brand.series, (set) => {
    result[brand.name][set.name] = set.lipsticks.map(item => item.color);
  });
});

console.log(JSON.stringify(result, null, 2));
