/**
 * Prefix and suffix for well-formed pipelines.
 */
const TIDYBLOCKS_START = '/* tidyblocks start */'
const TIDYBLOCKS_END = '/* tidyblocks end */'

/**
 * Value to indicate missing values.
 */
const MISSING = undefined

/**
 * Names for special columns.
 */
const GROUPCOL = '_group_'
const JOINCOL = '_join_'

/**
 * Turn block of CSV text into TidyBlocksDataFrame. The parser argument should be Papa.parse;
 * it is passed in here so that this file can be loaded both in the browser and for testing.
 * @param {string} text Text to parse.
 * @param {function} parser Function to turn CSV text into array of objects.
 * @returns New dataframe with sanitized column headers.
 */
const csv2TidyBlocksDataFrame = (text, parser) => {

  const seen = new Map() // global to transformHeader
  const transformHeader = (name) => {
    // Simple character fixes.
    name = name
      .trim()
      .replace(/ /g, '_')
      .replace(/[^A-Za-z0-9_]/g, '')

    // Ensure header is not empty after character fixes.
    if (name.length === 0) {
      name = 'EMPTY'
    }

    // Name must start with underscore or letter.
    if (! name.match(/^[_A-Za-z]/)) {
      name = `_${name}`
    }

    // Name must be unique.
    if (seen.has(name)) {
      const serial = seen.get(name) + 1
      seen.set(name, serial)
      name = `${name}_${serial}`
    }
    else {
      seen.set(name, 0)
    }

    return name
  }

  const result = parser(
    text.trim(),
    {
      dynamicTyping: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: transformHeader,
      transform: function(value) {
        return (value === "NA" | value === null) ? undefined : value
      },  
    }
  )
  return new TidyBlocksDataFrame(result.data)
}

/**
 * Get the prefix for registering blocks.
 * @param {string} fill Comma-separated list of quoted strings identifying pipelines to wait for.
 * @returns {string} Text to insert into generated code.
 */
const registerPrefix = (fill) => {
  return `${TIDYBLOCKS_START} TidyBlocksManager.register([${fill}], () => {`
}

/**
 * Get the suffix for registering blocks.
 * @param {string} fill Single quoted string identifying pipeline produced.
 * @returns {string} Text to insert into generated code.
 */
const registerSuffix = (fill) => {
  return `}, [${fill}]) ${TIDYBLOCKS_END}`
}

/**
 * Fix up runnable code if it isn't properly terminated yet.
 * @param {string} code Pipeline code to be terminated if necessary.
 */
const fixCode = (code) => {
  if (! code.endsWith(TIDYBLOCKS_END)) {
    const suffix = registerSuffix('')
    code += `.plot(environment, {}) ${suffix}`
  }
  return code
}

//--------------------------------------------------------------------------------

/**
 * Raise exception if a condition doesn't hold.
 * @param {Boolean} check Condition that must be true.
 * @param {string} message What to say if it isn't.
 */
const tbAssert = (check, message) => {
  if (! check) {
    throw new Error(message)
  }
}

/**
 * Check that a value is numeric.
 * @param value What to check.
 * @returns The input value if it passes the test.
 */
const tbAssertNumber = (value) => {
  tbAssert((value === MISSING) || (typeof value === 'number'),
           `Value ${value} is not missing or a number`)
  return value
}

/**
 * Check that the types of two values are the same.
 * @param left One of the values.
 * @param right The other value.
 */
const tbAssertTypeEqual = (left, right) => {
  tbAssert((left === MISSING) || (right === MISSING) || (typeof left === typeof right),
           `Values ${left} and ${right} have different types`)
}

//--------------------------------------------------------------------------------

/**
 * Count number of values (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Number of values.
 */
const tbCount = (rows, col) => {
  return rows.length
}
tbCount.colName = 'count'

/**
 * Find maximum value (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Maximum value.
 */
const tbMax = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate max of empty data`)
  return rows.reduce((soFar, row) => (row[col] > soFar) ? row[col] : soFar,
                     rows[0][col])
}
tbMax.colName = 'max'

/**
 * Find mean value (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Mean value.
 */
const tbMean = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate mean of empty data`)
  return rows.reduce((total, row) => total + row[col], 0) / rows.length
}
tbMean.colName = 'mean'

/**
 * Find median value (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Median value.
 */
const tbMedian = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate median of empty data`)
  const temp = [...rows]
  rows.sort((left, right) => {
    if (left[col] < right[col]) {
      return -1
    }
    else if (left[col] > right[col]) {
      return 1
    }
    return 0
  })
  return temp[Math.floor(rows.length / 2)][col]
}
tbMedian.colName = 'median'

/**
 * Find minimum value (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Minimum value.
 */
const tbMin = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate min of empty data`)
  return rows.reduce((soFar, row) => (row[col] < soFar) ? row[col] : soFar,
                     rows[0][col])
}
tbMin.colName = 'min'

/**
 * Find standard deviation (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Standard deviation.
 */
const tbStd = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate standard deviation of empty data`)
  const values = rows.map(row => row[col])
  return Math.sqrt(_variance(values))
}
tbStd.colName = 'std'

/**
 * Find sum (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Total.
 */
const tbSum = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate sum of empty data`)
  return rows.reduce((total, row) => total + row[col], 0)
}
tbSum.colName = 'sum'

/**
 * Find variance (colname property used in summarization).
 * @param {Array} rows The rows containing values.
 * @param {string} col The column of interest.
 * @return {number} Variance.
 */
const tbVariance = (rows, col) => {
  tbAssert(rows.length > 0,
           `Cannot calculate variance of empty data`)
  const values = rows.map(row => row[col])
  return _variance(values)
}
tbVariance.colName = 'variance'

const _variance = (values) => {
  const mean = values.reduce((total, val) => total + val, 0) / values.length
  const diffSq = values.map(val => (val - mean) ** 2)
  const result = diffSq.reduce((total, val) => total + val, 0) / diffSq.length
  return result
}

//--------------------------------------------------------------------------------

/**
 * Convert row value to Boolean.
 * @param {number{ blockId which block this is.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Boolean value.
 */
const tbToBoolean = (blockId, row, getValue) => {
  const value = getValue(row)
  return (value === MISSING)
    ? MISSING
    : (value ? true : false)
}

/**
 * Convert row value to datetime.
 * @param {number{ blockId which block this is.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value (must be string).
 * @returns Date object.
 */
const tbToDatetime = (blockId, row, getValue) => {
  const value = getValue(row)
  if (value === MISSING) {
    return MISSING
  }
  let result = new Date(value)
  if ((typeof result === 'object') && (result.toString() === 'Invalid Date')) {
    result = MISSING
  }
  return result
}

/**
 * Convert row value to number.
 * @param {number{ blockId which block this is.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Numeric value.
 */
const tbToNumber = (blockId, row, getValue) => {
  let value = getValue(row)
  if (value === MISSING) {
    // keep as is
  }
  else if (typeof value == 'boolean') {
    value = value ? 1 : 0
  }
  else if (typeof value == 'string') {
    value = parseFloat(value)
  }
  return value
}

/**
 * Convert row value to string.
 * @param {number{ blockId which block this is.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Text value.
 */
const tbToText = (blockId, row, getValue) => {
  let value = getValue(row)
  if (value === MISSING) {
    // keep as is
  }
  else if (typeof value !== 'string') {
    value = `${value}`
  }
  return value
}

//--------------------------------------------------------------------------------

/**
 * Check if value is Boolean.
 * @param {number} blockId The ID of the block.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Is value Boolean?
 */
const tbIsBoolean = (blockId, row, getValue) => {
  return typeof getValue(row) === 'boolean'
}

/**
 * Check if value is a datetime.
 * @param {number} blockId The ID of the block.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Is value numeric?
 */
const tbIsDateTime = (blockId, row, getValue) => {
  return getValue(row) instanceof Date
}

/**
 * Check if value is missing.
 * @param {number} blockId The ID of the block.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Is value missing?
 */
const tbIsMissing = (blockId, row, getValue) => {
  return getValue(row) === MISSING
}

/**
 * Check if value is number.
 * @param {number} blockId The ID of the block.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Is value numeric?
 */
const tbIsNumber = (blockId, row, getValue) => {
  return typeof getValue(row) === 'number'
}

/**
 * Check if value is string.
 * @param {number} blockId The ID of the block.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Is value text?
 */
const tbIsText = (blockId, row, getValue) => {
  return typeof getValue(row) === 'string'
}

//--------------------------------------------------------------------------------

/*
 * Extract year from value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Year as number.
 */
const tbToYear = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getFullYear()
}

/**
 * Extract month from value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Month as number.
 */
const tbToMonth = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getMonth() + 1 // normalize to 1-12 to be consistent with days of month
}

/**
 * Extract day of month from value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Day of month as number.
 */
const tbToDay = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getDate()
}

/**
 * Extract day of week from value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Day of week as number
 */
const tbToWeekDay = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getDay()
}

/**
 * Extract hours from date value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Hours portion of value.
 */
const tbToHours = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getHours()
}

/**
 * Extract minutes from date value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Minutes portion of value.
 */
const tbToMinutes = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getMinutes()
}

/**
 * Extract seconds from date value.
 * @param {Object} row Row containing values.
 * @param {function} getValue How to get desired value.
 * @returns Seconds portion of value.
 */
const tbToSeconds = (row, getValue) => {
  const value = getValue(row)
  tbAssert(value instanceof Date,
           `Expected date object not "${value}"`)
  return value.getSeconds()
}

//--------------------------------------------------------------------------------

/**
 * Numeric value if legal or missing value if not.
 */
const safeValue = (value) => {
  return isFinite(value) ? value : MISSING
}

/**
 * Get a column's value from a row, failing if the column doesn't exist.
 * @param {Object} row The row to look in.
 * @param {string} column The field to look up.
 * @returns The value.
 */
const tbGet = (blockId, row, column) => {
  tbAssert(column in row,
           `[block ${blockId}] no such column "${column}" (have [${Object.keys(row).join(',')}])`)
  return row[column]
}

/**
 * Add two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The sum.
 */
const tbAdd = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left + right)
}

/**
 * Divide two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The quotient.
 */
const tbDiv = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left / right)
}

/**
 * Calculate an exponent.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The exponentiated value.
 */
const tbExp = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left ** right)
}

/**
 * Find the remainder of two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The remainder.
 */
const tbMod = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left % right)
}

/**
 * Multiply two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The product.
 */
const tbMul = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left * right)
}

/**
 * Negate a value.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getValue How to get the value from the row.
 * @returns The numerical negation.
 */
const tbNeg = (blockId, row, getValue) => {
  const value = tbAssertNumber(getValue(row))
  return (value === MISSING) ? MISSING : (- value)
}

/**
 * Subtract two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The difference.
 */
const tbSub = (blockId, row, getLeft, getRight) => {
  const left = tbAssertNumber(getLeft(row))
  const right = tbAssertNumber(getRight(row))
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : safeValue(left - right)
}

//--------------------------------------------------------------------------------

/**
 * Logical conjunction of two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The conjunction.
 */
const tbAnd = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  return left && right
}

/**
 * Logical negation of a value.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getValue How to get the value from the row.
 * @returns The logical conjunction.
 */
const tbNot = (blockId, row, getValue) => {
  const value = getValue(row)
  return (value === MISSING) ? MISSING : ((! value) ? true : false)
}

/**
 * Logical disjunction of two values.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The disjunction.
 */
const tbOr = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  return left || right
}

/**
 * Choosing a value based on a logical condition.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getCond How to get the condition's value.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The left (right) value if the condition is true (false).
 */

const tbIfElse = (rowId, row, getCond, getLeft, getRight) => {
  const cond = getCond(row)
  return (cond === MISSING)
    ? MISSING
    : (cond ? getLeft(row) : getRight(row))
}

//--------------------------------------------------------------------------------

/**
 * Strict greater than.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbGt = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left > right)
}

/**
 * Greater than or equal.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbGeq = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left >= right)
}

/**
 * Equality.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbEq = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left === right)
}

/**
 * Inequality.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbNeq = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left !== right)
}

/**
 * Less than or equal.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbLeq = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left <= right)
}

/**
 * Strictly less than.
 * @param {number} blockId The ID of the block.
 * @param {Object} row The row to get values from.
 * @param {function} getLeft How to get the left value from the row.
 * @param {function} getRight How to get the right value from the row.
 * @returns The comparison's result.
 */
const tbLt = (blockId, row, getLeft, getRight) => {
  const left = getLeft(row)
  const right = getRight(row)
  tbAssertTypeEqual(left, right)
  return ((left === MISSING) || (right === MISSING))
    ? MISSING
    : (left < right)
}

//--------------------------------------------------------------------------------

/**
 * Store a dataframe.
 */
class TidyBlocksDataFrame {

  /**
   * Construct a new dataframe.
   * @param {Object[]} values The initial values (aliased).
   */
  constructor (values, oldColumns=null) {
    this.data = values
    this.columns = this._makeColumns(values, oldColumns)
  }

  //------------------------------------------------------------------------------

  /**
   * Drop columns.
   * @param {string[]} columns The names of the columns to discard.
   * @returns A new dataframe.
   */
  drop (blockId, columns) {
    tbAssert(columns.length !== 0,
             `[block ${blockId}] no columns specified for drop`)
    tbAssert(this.hasColumns(columns),
             `[block ${blockId}] unknown column(s) [${columns}] in drop`)
    const keep = Array.from(this.columns).filter(c => (! columns.includes(c)))
    return this.select(blockId, keep)
  }

  /**
   * Filter rows, keeping those that pass a test.
   * @param {function} op How to test rows.
   * @returns A new dataframe.
   */
  filter (blockId, op) {
    tbAssert(op, `[block ${blockId}] no operator for filter`)
    const newData = this.data.filter(row => {
      return op(row)
    })
    const newColumns = this._makeColumns(newData, this.columns)
    return new TidyBlocksDataFrame(newData, newColumns)
  }

  /**
   * Group by the values in a column, storing the result in a new grouping column.
   * @param {string[]} columns The columns that determine groups.
   * @returns A new dataframe.
   */
  groupBy (blockId, columns) {
    tbAssert(columns.length > 0,
             `[block ${blockId}] empty column name(s) for grouping`)
    tbAssert(this.hasColumns(columns),
             `[block ${blockId}] unknown column(s) ${columns} in groupBy`)
    tbAssert(columns.length === (new Set(columns)).size,
             `[block ${blockId}] duplicate column(s) in [${columns}] in groupBy`)
    const seen = new Map()
    let nextGroupId = 0
    const groupedData = this.data.map(row => {
      const thisGroupId = this._makeGroupId(blockId, seen, row, columns, nextGroupId)
      if (thisGroupId === nextGroupId) {
        nextGroupId += 1
      }
      const newRow = {...row}
      newRow[GROUPCOL] = thisGroupId
      return newRow
    })
    const newColumns = this._makeColumns(groupedData, this.columns, {add: [GROUPCOL]})
    return new TidyBlocksDataFrame(groupedData, newColumns)
  }

  /**
   * Create a new column by operating on existing columns.
   * @param {string} newName New column's name.
   * @param {function} op How to create new values from a row.
   * @returns A new dataframe.
   */
  mutate (blockId, newName, op) {
    tbAssert(newName,
             `[block ${blockId}] empty new column name for mutate`)
    tbAssert(typeof op === 'function',
             `[block ${blockId}] new value is not a function`)
    const newData = this.data.map(row => {
      const newRow = {...row}
      newRow[newName] = op(row)
      return newRow
    })
    const newColumns = this._makeColumns(newData, this.columns, {add: [newName]})
    return new TidyBlocksDataFrame(newData, newColumns)
  }

  /**
   * Select columns.
   * @param {string[]} columns The names of the columns to keep.
   * @returns A new dataframe.
   */
  select (blockId, columns) {
    tbAssert(columns.length > 0,
             `[block ${blockId}] no columns specified for select`)
    tbAssert(this.hasColumns(columns),
             `[block ${blockId}] unknown column(s) [${columns}] in select`)
    const newData = this.data.map(row => {
      const result = {}
      columns.forEach(key => {
        result[key] = tbGet(blockId, row, key)
      })
      return result
    })
    return new TidyBlocksDataFrame(newData, columns)
  }

  /**
   * Sort data by values in specified columns.
   * @param {string[]} columns Names of columns to sort by.
   * @returns New data frame with sorted data.
   */
  sort (blockId, columns, reverse) {
    tbAssert(columns.length > 0,
             `[block ${blockId}] no columns specified for sort`)
    tbAssert(this.hasColumns(columns),
             `[block ${blockId}] unknown column(s) [${columns}] in sort`)
    const result = [...this.data]
    result.sort((left, right) => {
      return columns.reduce((soFar, col) => {
        if (soFar !== 0) {
          return soFar
        }
        if (left[col] < right[col]) {
          return -1
        }
        if (left[col] > right[col]) {
          return 1
        }
        return 0
      }, 0)
    })
    if (reverse) {
      result.reverse()
    }
    return new TidyBlocksDataFrame(result, this.columns)
  }

  /**
   * Summarize values (possibly grouped).
   * @param {string} operations A list of [blockId, function, columnName] pairs.
   * @return A new dataframe.
   */
  summarize (blockId, ...operations) {
    // Check column names.
    operations.forEach(([subBlockId, func, sourceColumn]) => {
      subBlockId = (subBlockId === undefined) ? blockId : subBlockId
      tbAssert(sourceColumn,
               `[block ${subBlockId}] no column specified for summarize`)
      tbAssert(this.hasColumns(sourceColumn),
               `[block ${subBlockId}] unknown column "${sourceColumn}" in summarize`)
    })

    // Summarize operation by operation.
    const newData = this.data.map(row => {return {...row}})
    const newColumnNames = []
    operations.forEach(([subBlockId, func, sourceColumn]) => {
      subBlockId = (subBlockId === undefined) ? blockId : subBlockId
      const destColumn = `${sourceColumn}_${func.colName}`
      newColumnNames.push(destColumn)
      this._summarizeColumn(newData, subBlockId, func, sourceColumn, destColumn)
    })

    // Create new dataframe.
    return new TidyBlocksDataFrame(newData, newColumnNames)
  }

  /**
   * Remove grouping if present.
   * @returns A new dataframe.
   */
  ungroup (blockId) {
    tbAssert(this.hasColumns(GROUPCOL),
             `[block ${blockId}] cannot ungroup data that is not grouped`)
    const newData = this.data.map(row => {
      row = {...row}
      delete row[GROUPCOL]
      return row
    })
    const newColumns = this._makeColumns(newData, this.columns, {remove: [GROUPCOL]})
    return new TidyBlocksDataFrame(newData, newColumns)
  }

  /**
   * Select rows with unique values in columns.
   * @param {string[]} columns The names of the columns to use for uniqueness test.
   * @returns A new dataframe.
   */
  unique (blockId, columns) {
    tbAssert(columns.length > 0,
             `[block ${blockId}] no columns specified for select`)
    tbAssert(this.hasColumns(columns),
             `[block ${blockId}] unknown column(s) [${columns}] in select`)
    const seen = new Map()
    const newData = []
    this.data.forEach(row => this._findUnique(blockId, seen, newData, row, columns))
    return new TidyBlocksDataFrame(newData, columns)
  }

  //------------------------------------------------------------------------------

  /**
   * Join two tables on equality between values in specified columns.
   * @param {function} getDataFxn How to look up data by name.
   * @param {string} leftFrame Notification name of left table to join.
   * @param {string} leftColumn Name of column from left table.
   * @param {string} rightFrame Notification name of right table to join.
   * @param {string} rightColumn Name of column from right table.
   * @returns A new dataframe.
   */
  join (getDataFxn, leftFrameName, leftColumn, rightFrameName, rightColumn) {

    const leftFrame = getDataFxn(leftFrameName)
    tbAssert(leftFrame.hasColumns(leftColumn),
             `left table does not have column ${leftColumn}`)
    const rightFrame = getDataFxn(rightFrameName)
    tbAssert(rightFrame.hasColumns(rightColumn),
             `right table does not have column ${rightColumn}`)

    const result = []
    for (let leftRow of leftFrame.data) { 
      for (let rightRow of rightFrame.data) { 
        if (leftRow[leftColumn] === rightRow[rightColumn]) {
          const row = {}
          row[JOINCOL] = leftRow[leftColumn]
          this._addFieldsExcept(row, leftFrameName, leftRow, leftColumn)
          this._addFieldsExcept(row, rightFrameName, rightRow, rightColumn)
          result.push(row)
        }
      }
    }

    const newColumns = []
    this._addColumnsExcept(newColumns, leftFrameName, leftFrame.columns, leftColumn)
    this._addColumnsExcept(newColumns, rightFrameName, rightFrame.columns, rightColumn)

    return new TidyBlocksDataFrame(result, newColumns)
  }

  /**
   * Notify the pipeline manager that this pipeline has completed so that downstream joins can run.
   * Note that this function is called at the end of a pipeline, so it does not return 'this' to support method chaining.
   * @param {function} notifyFxn Callback functon to do notification (to decouple this class from the manager).
   * @param {string} name Name of this pipeline.
   */
  notify (notifyFxn, name) {
    notifyFxn(name, this)
  }

  //------------------------------------------------------------------------------

  /**
   * Call a plotting function. This is in this class to support method chaining
   * and to decouple this class from the real plotting functions so that tests
   * will run.
   * Note that this function is called at the end of a pipeline, so it does not return 'this' to support method chaining.
   * @param {object} environment Connection to the outside world.
   * @param {object} spec Vega-Lite specification with empty 'values' (filled in here with actual data before plotting).
   * @returns This object.
   */
  plot (environment, spec) {
    environment.displayFrame(this)
    if (Object.keys(spec).length !== 0) {
      spec.data.values = this.data
      environment.displayPlot(spec)
    }
  }

  //------------------------------------------------------------------------------

  /**
   * Test whether the dataframe has the specified columns.
   * @param {string[]} names Names of column to check for.
   * @returns {Boolean} Are columns present?
   */
  hasColumns (names) {
    if (typeof names === 'string') {
      names = [names]
    }
    return names.every(n => (this.columns.has(n)))
  }

  /**
   * Convert columns to numeric values.
   * @param {string[]} columns The names of the columns to convert.
   * @returns This object.
   */
  toNumber (blockId, columns) {
    this.data.forEach(row => {
      columns.forEach(col => {
        row[col] = parseFloat(tbGet(blockId, row, col))
      })
    })
    return this
  }

  //------------------------------------------------------------------------------

  //
  // Add fields to object except the join field.
  //
  _addFieldsExcept (result, tableName, row, exceptName) {
    Object.keys(row)
      .filter(key => (key != exceptName))
      .forEach(key => {result[`${tableName}_${key}`] = row[key]})
  }

  //
  // Add columns to column list except the join column.
  //
  _addColumnsExcept (result, tableName, columns, exceptName) {
    columns.forEach(col => {
      if (col != exceptName) {
        result.push(`${tableName}_${col}`)
      }
    })
    return result
  }

  //
  // Create columns for new table from data, existing columns, and explict add/remove lists.
  //
  _makeColumns (data, oldColumns, extras={}) {
    const result = new Set()

    // Trust the data if there is some.
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => result.add(key))
    }

    // Construct.
    else {
      if (oldColumns) {
        oldColumns.forEach(name => result.add(name))
      }
      if ('add' in extras) {
        extras.add.forEach(name => result.add(name))
      }
      if ('remove' in extras) {
        extras.remove.forEach(name => result.remove(name))
      }
    }

    return result
  }

  //
  // Recurse down a list of column names to find or construct a group ID.
  //
  _makeGroupId (blockId, seen, row, columns, nextGroupId) {
    const thisValue = tbGet(blockId, row, columns[0])
    const otherColumns = columns.slice(1)
    if (seen.has(thisValue)) {
      if (otherColumns.length === 0) {
        return seen.get(thisValue)
      }
      else {
        const subMap = seen.get(thisValue)
        return this._makeGroupId(blockId, subMap, row, otherColumns, nextGroupId)
      }
    }
    else {
      if (otherColumns.length === 0) {
        seen.set(thisValue, nextGroupId)
        return nextGroupId
      }
      else {
        const subMap = new Map()
        seen.set(thisValue, subMap)
        return this._makeGroupId(blockId, subMap, row, otherColumns, nextGroupId)
      }
    }
  }

  //
  // Summarize a single column in place.
  //
  _summarizeColumn (data, blockId, func, sourceColumn, destColumn) {
    // Divide values into groups.
    const groups = new Map()
    data.forEach(row => {
      const groupId = (GROUPCOL in row) ? row[GROUPCOL] : null
      if (! groups.has(groupId)) {
        groups.set(groupId, [])
      }
      groups.get(groupId).push(row)
    })

    // Summarize each group.
    for (let groupId of groups.keys()) {
      const result = func(groups.get(groupId), sourceColumn)
      groups.set(groupId, result)
    }

    // Paste back in each row.
    data.forEach(row => {
      const groupId = (GROUPCOL in row) ? row[GROUPCOL] : null
      row[destColumn] = groups.get(groupId)
    })
  }

  //
  // Find unique values across multiple columns.
  //
  _findUnique (blockId, seen, newData, row, columns) {
    const thisValue = tbGet(blockId, row, columns[0])
    const otherColumns = columns.slice(1)
    if (otherColumns.length === 0) {
      if (! seen.has(thisValue)) {
        seen.set(thisValue, true)
        newData.push(row)
      }
    }
    else {
      if (! seen.has(thisValue)) {
        seen.set(thisValue, new Map())
      }
      this._findUnique(blockId, seen.get(thisValue), newData, row, otherColumns)
    }
  }
}

//--------------------------------------------------------------------------------

/**
 * Manage execution of all data pipelines.
 */
class TidyBlocksManagerClass {

  /**
   * Create manager.
   */
  constructor () {
    this.reset()
  }

  /**
   * Record a newly-created block and add the ID to its tooltip.
   * @param {block} block Newly-created block.
   */
  addNewBlock (block) {
    block.tbId = this.nextBlockId
    block.tooltip = `[${block.tbId}] ${block.tooltip}`
    this.blocks.set(this.nextBlockId, block)
    this.nextBlockId += 1
  }

  /**
   * Get the number of blocks that have been created (including ones that have
   * now been deleted).
   */
  getNumBlocks () {
    return this.blocks.size
  }

  /**
   * Get a block by serial number.
   * @param {number} blockId Serial number of block.
   * @returns {block} The block or null.
   */
  getBlock (blockId) {
    return this.blocks.has(blockId) ? this.blocks.get(blockId) : null
  }

  /**
   * Get the output of a completed pipeline.
   * @param {string} name Name of completed pipeline.
   * @return TidyBlocksDataFrame.
   */
  getResult (name) {
    return this.results.get(name)
  }

  /**
   * Notify the manager that a named pipeline has finished running.
   * This enqueues pipeline functions to run if their dependencies are satisfied.
   * @param {string} name Name of the pipeline that just completed.
   * @param {Object} dataFrame The TidyBlocksDataFrame produced by the pipeline.
   */
  notify (name, dataFrame) {
    this.results.set(name, dataFrame)
    this.waiting.forEach((dependencies, func) => {
      dependencies.delete(name)
      if (dependencies.size === 0) {
        this.queue.push(func)
      }
    })
  }

  /**
   * Register a new pipeline function with what it depends on and what it produces.
   * @param {string[]} depends Names of things this pipeline depends on (if it starts with a join).
   * @param {function} func Function encapsulating pipeline to run.
   * @param {function} produces Name of this pipeline (used to trigger things waiting for it).
   */
  register (depends, func, produces) {
    if (depends.length == 0) {
      this.queue.push(func)
    }
    else {
      this.waiting.set(func, new Set(depends))
    }
  }

  /**
   * Reset internal state.
   */
  reset () {
    this.queue = []
    this.waiting = new Map()
    this.results = new Map()
    this.blocks = new Map()
    this.nextBlockId = 0
  }

  /**
   * Run all pipelines in an order that respects dependencies.
   * This depends on `notify` to add pipelines to the queue.
   * @param {object} environment How to interact with the outside world.
   */
  run (environment) {
    environment.displayError('') // clear legacy errors
    try {
      let code = environment.getCode()
      if (! code.includes(TIDYBLOCKS_START)) {
        throw new Error('pipeline does not have a valid start block')
      }
      code = fixCode(code)
      eval(code)
      while (this.queue.length > 0) {
        const func = this.queue.shift()
        func()
      }
    }
    catch (err) {
      environment.displayError(err.message)
    }
  }
}

/**
 * Singleton instance of manager.
 */
const TidyBlocksManager = new TidyBlocksManagerClass()

//--------------------------------------------------------------------------------

// Make this file require'able if running from the command line.
if (typeof module !== 'undefined') {
  module.exports = {
    MISSING,
    GROUPCOL,
    JOINCOL,
    csv2TidyBlocksDataFrame,
    registerPrefix,
    registerSuffix,
    TidyBlocksDataFrame,
    TidyBlocksManager
  }
}
