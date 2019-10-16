import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for join block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'plumbing_join',
    message0: 'Join %1 %2 %3 %4',
    args0: [
      {
        type: 'field_input',
        name: 'LEFT_TABLE',
        text: 'left_table'
      },
      {
        type: 'field_input',
        name: 'LEFT_COLUMN',
        text: 'left_column'
      },
      {
        type: 'field_input',
        name: 'RIGHT_TABLE',
        text: 'right_table'
      },
      {
        type: 'field_input',
        name: 'RIGHT_COLUMN',
        text: 'right_column'
      }
    ],
    inputsInline: true,
    nextStatement: null,
    style: 'plumbing_blocks',
    hat: 'cap',
    tooltip: 'join two tables',
    helpUrl: '',
    extensions: ['validate_LEFT_TABLE', 'validate_LEFT_COLUMN', 'validate_RIGHT_TABLE', 'validate_RIGHT_COLUMN']
  }
])
