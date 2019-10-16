import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for negation block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_negate',
    message0: 'Negate %1',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'value_blocks',
    tooltip: 'negate a numeric column',
    helpUrl: ''
  }
])
