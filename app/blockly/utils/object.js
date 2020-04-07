/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utility methods for objects.
 * @author samelh@google.com (Sam El-Husseini)
 */
'use strict';

/**
 * Complete a deep merge of all members of a source object with a target object.
 * @param {!Object} target Target.
 * @param {!Object} source Source.
 * @return {!Object} The resulting object.
 */
Blockly.utils.object.deepMerge = function(target, source) {
    for (var x in source) {
      if (typeof source[x] === 'object') {
        target[x] = Blockly.utils.object.deepMerge(
            target[x] || Object.create(null), source[x]);
      } else {
        target[x] = source[x];
      }
    }
    return target;
  };