import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for comparison block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_compare',
    message0: '%1 %2 %3',
    args0: [
      {
        type: 'input_value',
        name: 'LEFT'
      },
      {
        type: 'field_dropdown',
        name: 'OP',
        options: [
          ['=', 'tbEq'],
          ['\u2260', 'tbNeq'],
          ['\u200F<', 'tbLt'],
          ['\u200F\u2264', 'tbLeq'],
          ['\u200F>', 'tbGt'],
          ['\u200F\u2265', 'tbGeq']
        ]
      },
      {
        type: 'input_value',
        name: 'RIGHT'
      }
    ],
    inputsInline: true,
    output: 'Boolean',
    style: 'value_blocks',
    tooltip: 'compare two columns',
    helpUrl: ''
  }
])
