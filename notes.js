const fs = require("fs")
const chalk = require("chalk")

const addNote = (title, body) => {
  const notes = loadNotes()
  const duplicateNote = notes.find((note) => note.title === title)
  if (!duplicateNote) {
    notes.push({
      title: title,
      body: body,
    })
    saveNotes(notes)
    console.log(chalk.green.inverse("New note added!"))
  } else {
    console.log(chalk.red.inverse("Note title taken!"))
  }
}

const removeNote = (title) => {
  console.log("Removing the note: " + title)
  const notes = loadNotes()
  const updatedNotes = notes.filter((note) => note.title !== title)
  saveNotes(updatedNotes)
}

const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync("notes.json", dataJSON)
}

const listNotes = () => {
  console.log("Your notes:")
  const notes = loadNotes()
  notes.forEach((note, index) => {
    console.log(`${index + 1}. ${note.title}`)
  })
}

const readNote = (title) => {
  const notes = loadNotes()
  const note = notes.find((note) => note.title === title)
  if (note) {
    console.log(chalk.inverse(note.title))
    console.log(note.body)
  } else {
    console.log(chalk.red.inverse("Note not found!"))
  }
}

const loadNotes = () => {
  console.log("Loading your notes...")
  try {
    const dataBuffer = fs.readFileSync("notes.json")
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  } catch (error) {
    return []
  }
}

module.exports = {
  addNote,
  removeNote,
  loadNotes,
  listNotes,
  readNote,
}
