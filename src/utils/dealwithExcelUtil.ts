import fs from 'file-saver'
import * as XLSX from 'xlsx'
import * as XLSX_STYLE from 'xlsx-style-vite'


export function xlsx(json, fields, filename = '.xlsx') {//导出xlsx
  let fieldData = []
  json.forEach(item => {
    let b = {}
    for (let i in item) {
      if (fields.hasOwnProperty(i)) {
        b[fields[i]] = item[i]
        item[fields[i]] = item[i];
      }
    }
    fieldData.push(b)
  })
  let sheetName = filename //excel的文件名称
  let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  let ws = XLSX.utils.json_to_sheet(fieldData, { header: Object.values(fields) }) //将JS对象数组转换为工作表。
  let a = []
  for (let i in fields) {
    a.push({ wpx: 200 })
  }
  ws['!cols'] = a
  wb.SheetNames.push(sheetName)
  wb.Sheets[sheetName] = ws
  const defaultCellStyle = { font: { name: "Verdana", sz: 16,bold: true, color: "FF00FF88",vertAlign: true },alignment: { horizontal: 'center',vertical: 'center', wrapText: true  }, fill: { fgColor: { rgb: "FFFFAA00" } } };//设置表格的样式
  let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary', cellStyles: true, defaultCellStyle: defaultCellStyle, showGridLines: false }  //写入的样式
  let wbout = XLSX.write(wb, wopts)
  let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  fs.saveAs(blob, filename + '.xlsx')
}

export function scorexlsx(json, fields, filename = '.xlsx') {//导出xlsx
  let fieldData = []
  json.forEach(item => {
    let b = {}
    for (let i in item) {
      if (fields.hasOwnProperty(i)) {
        b[fields[i]] = item[i]
        item[fields[i]] = item[i];
      }
    }
    fieldData.push(b)
  })
  let sheetName = filename //excel的文件名称
  let wb = XLSX.utils.book_new()  //工作簿对象包含一SheetNames数组，以及一个表对象映射表名称到表对象。XLSX.utils.book_new实用函数创建一个新的工作簿对象。
  let ws = XLSX.utils.json_to_sheet(fieldData, { header: Object.values(fields) }) //将JS对象数组转换为工作表。
  let a = [{ wpx: 50 },{ wpx: 220 },{ wpx: 80 },{ wpx: 80 },{ wpx: 220 }]
  ws['!cols'] = a
  //给所以单元格加上边框
  for (var i in ws) {
    if (i == '!ref' || i == '!merges' || i == '!cols') {

    } else {
      ws[i].s = {
        font: {
          name: '宋体',
          sz: 12,
          color: {rgb: "000000"},
          bold: false,
        },
        border: {  //单元格外侧框线
          top: {
            style: 'thin',
            color: { rgb: "000000" }
          },
          bottom: {
            style: 'thin',
            color: { rgb: "000000" }
          },
          left: {
            style: 'thin',
            color: { rgb: "000000" }
          },
          right: {
            style: 'thin',
            color: { rgb: "000000" }
          }
        },
        alignment:{
          horizontal:"center",
          wrapText:true,
          vertical:'center'
        }
      }
      if(i == 'A1' || i == 'B1' || i == 'C1' || i == 'D1' || i == 'E1'){
        ws[i].s.font.bold = true
      }
      if(i.indexOf('B') == 0 && i !== 'B1'){
        ws[i].s.alignment.horizontal="left"
      }
    }
  }
  wb.SheetNames.push(sheetName)
  wb.Sheets[sheetName] = ws
  console.log(wb.Sheets[sheetName])
  let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary'}  //写入的样式
  let wbout = XLSX_STYLE.write(wb, wopts)
  let blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  fs.saveAs(blob, filename + '.xlsx')
}

const s2ab = s => {
  var buf;
  if (typeof ArrayBuffer !== 'undefined') {
    buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  } else {
    buf = new Array(s.length);
    for (var i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }
}
