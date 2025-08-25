const fs = require("fs")

const getNote = (title) => {
  const notes = loadNotes()
  console.log("Getting the note: " + title)
  const note = notes.filter((note) => note.title === title)
  if (note) {
    console.log(note.body)
  } else {
    console.log("Note not found!")
  }
}

const addNote = (title, body) => {
  const notes = loadNotes()

  const duplicateNotes = notes.filter((note) => note.title === title)

  if (duplicateNotes.length === 0) {
    notes.push({
      title: title,
      body: body,
    })
    saveNotes(notes)
    console.log("New note added!")
  } else {
    console.log("Note title taken!")
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
  getNote,
  addNote,
  removeNote,
  loadNotes,
  listNotes
}
