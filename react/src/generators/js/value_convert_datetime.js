import * as Blockly from 'blockly/core';
import 'blockly/javascript';
//
// Implement date/time extraction.
//
Blockly.JavaScript['value_convert_datetime'] = (block) => {
  const type = block.getFieldValue('TYPE')
  const order = Blockly.JavaScript.ORDER_NONE
  const value = Blockly.JavaScript.valueToCode(block, 'VALUE', order)
  const code = `(row) => ${type}(row, ${value})`
  return [code, order]
}
