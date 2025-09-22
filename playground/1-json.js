const fs = require('fs')

// const book = {
//   title: "Ego is the Enemy",
//   author: "Ryan Holiday",
//   year: 2016
// }

// const bookJSON = JSON.stringify(book)
// fs.writeFileSync('1-json.json', bookJSON)

// const dataBuffer = fs.readFileSync('1-json.json')
// const dataJSON = dataBuffer.toString()
// const data = JSON.parse(dataJSON)
// console.log(data.title)

const dataBuffer = fs.readFileSync('1-json.json')
const dataJSON = dataBuffer.toString()
const user = JSON.parse(dataJSON)
user.name = 'Mike'
user.age = 28
const userJSON = JSON.stringify(user)
fs.writeFileSync('1-json.json', userJSON)
const data = JSON.parse(userJSON)
console.log(data)