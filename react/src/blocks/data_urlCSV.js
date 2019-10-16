import * as Blockly from 'blockly/core';
import BlocklyReactField from '../fields/BlocklyReactField';
//
// Visuals for block that downloads CSV from the web.
//
Blockly.defineBlocksWithJsonArray([
  {
    type: 'data_urlCSV',
    message0: 'Import CSV %1',
    args0: [
      {
        type: 'field_input',
        name: 'URL',
        text: 'url'
      }
    ],
    nextStatement: null,
    style: 'data_blocks',
    hat: 'cap',
    tooltip: 'download CSV data from a URL',
    helpUrl: ''
  }
])
