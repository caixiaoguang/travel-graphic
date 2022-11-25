import * as XLSX from 'xlsx'

function readWorkbook(workbook) {
  const result = []
  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(worksheet)
    result.push(json)
  })
  return result
}

export function loadRemoteFile(url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest()
    xhr.open('get', url, true)
    xhr.responseType = 'arraybuffer'
    xhr.onload = function () {
      if (xhr.status == 200) {
        try {
          const data = new Uint8Array(xhr.response)
          const workbook = XLSX.read(data, { type: 'array' })
          resolve(readWorkbook(workbook))
        } catch (err) {
          console.log(err)
          reject(err)
        }
      } else {
        reject(xhr.response)
      }
    }
    xhr.send()
  })
}

export function degree2decimal(degreeString) {
  const degreeMain = degreeString.split('°')[0]
  const degreeMinute = degreeString.split('°')[1].split('ˊ')[0]
  const degreeSecond = degreeString.split('ˊ')[1].split('″')[0]
  return (Number(degreeSecond) / 60 + Number(degreeMinute)) / 60 + Number(degreeMain)
}
