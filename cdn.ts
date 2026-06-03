/** cdn代码错误解析
 * 1、错误类型：
 * Uncaught Error: Minified React error #419; visit https://reactjs.org/docs/error-decoder.html?invariant=419 for the full message or use the non-minified dev environment for full errors and additional h
 * 2、错误位置：
 *     at https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js:9:91918
    at uL (https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js:9:92763)
    at c (https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js:9:144329)
    at cm (https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js:9:119418)
*/

/**
 * https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js
 * 对应的map文件：
 * https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/map/nfes-c61fb194816f9b58.js.map
 */
const fs = require('fs')
const SourceMapConsumer = require('source-map').SourceMapConsumer

// 下载nfes-c61fb194816f9b58.js.map
fetch('https://ak-s-cw.tripcdn.com/NFES/trip-hotel-online/1780307901631/_next/static/chunks/nfes-c61fb194816f9b58.js.map')
.then(response => response.text())
.then(data => {
    fs.writeFileSync('nfes-c61fb194816f9b58.js', data)
})

const sourceMap = fs.readFileSync('nfes-c61fb194816f9b58.js', 'utf8')
const sourceMapConsumer = new SourceMapConsumer(sourceMap)
const line = 9
const column = 91918

// 查询第 9 行 91918 列的原始位置
const originalPosition = sourceMapConsumer.originalPositionFor({
    line: line,
    column: column
})

console.log('源文件:', originalPosition.source);
console.log('源代码行号:', originalPosition.line);
console.log('源代码列号:', originalPosition.column);
console.log('函数名:', originalPosition.name);
