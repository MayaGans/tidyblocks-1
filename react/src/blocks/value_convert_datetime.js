import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for datetime extraction block.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'value_convert_datetime',
    message0: '%1 date/time %2',
    args0: [
      {
        type: 'input_value',
        name: 'VALUE'
      },
      {
        type: 'field_dropdown',
        name: 'TYPE',
        options: [
          ['year', 'tbToYear'],
          ['month', 'tbToMonth'],
          ['day', 'tbToDay'],
          ['weekday', 'tbToWeekDay'],
          ['hours', 'tbToHours'],
          ['minutes', 'tbToMinutes'],
          ['seconds', 'tbToSeconds']
        ]
      }
    ],
    inputsInline: true,
    output: 'Number',
    style: 'value_blocks',
    tooltip: 'change the datatype of a value',
    helpUrl: ''
  }
])
