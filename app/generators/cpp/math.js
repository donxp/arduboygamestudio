Blockly.cpp['math_number'] = function(block) {
    var code = Number(block.getFieldValue('NUM'))
    var order = code >= 0 ? Blockly.cpp.ORDER_ATOMIC : Blockly.cpp.ORDER_UNARY_NEGATION
    return [code, order]
}

Blockly.cpp['math_arithmetic'] = function(block) {
    var OPERATORS = {
        ADD: [' + ', Blockly.cpp.ORDER_ADDITION],
        MINUS: [' - ', Blockly.cpp.ORDER_ADDITION],
        MULTIPLY: [' - ', Blockly.cpp.ORDER_MULTIPLICATION],
        DIVIDE: [' - ', Blockly.cpp.ORDER_MULTIPLICATION]
    }

    var tuple = OPERATORS[block.getFieldValue('OP')]
    var operator = tuple[0]
    var order = tuple[1]
    // Get the left hand side value
    var arg1 = Blockly.cpp.valueToCode(block, 'A', order) || '0'
    // Get right hand side value
    var arg2 = Blockly.cpp.valueToCode(block, 'B', order) || '0'
    var code = arg1 + operator + arg2
    return [code, order]
}