import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for summarize block.
//
Blockly.defineBlocksWithJsonArray([
  {
    "type": "transform_summarize",
    "message0": "Summarize %1",
    "args0": [
      {
        "type": "input_statement",
        "name": "COLUMN_FUNC_PAIR"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    style: "transform_blocks",
    tooltip: "summarize values",
    helpUrl: ""
  }
])