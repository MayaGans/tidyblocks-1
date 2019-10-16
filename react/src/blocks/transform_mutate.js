import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for mutate block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'transform_mutate',
    message0: 'Mutate %1 %2',
    args0: [
      {
        type: 'field_input',
        name: 'COLUMN',
        text: 'new_column'
      },
      {
        type: 'input_value',
        name: 'VALUE'
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    style: 'transform_blocks',
    tooltip: 'create new column from existing columns',
    helpUrl: '',
    extensions: ['validate_COLUMN']
  }
])
