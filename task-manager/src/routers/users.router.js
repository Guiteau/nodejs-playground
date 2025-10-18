const express = require("express")
const User = require("../models/user.model")
const router = new express.Router()

// Endpoints for Users
router.post("/user", (req, res) => {
  console.log("Creating user...")
  const user = new User(req.body)
  user
    .save()
    .then(() => {
      res.status(201).send(user)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.get("/users", (req, res) => {
  console.log("Fetching users...")
  User.find({})
    .then((users) => {
      res.send(users)
      console.log("Users fetched:", users)
    })
    .catch((error) => {
      console.log("Error fetching users:", error)
      res.status(500).send()
    })
})

router.get("/user/:id", (req, res) => {
  const _id = req.params.id
  console.log(`Fetching user with ID: ${_id}`)
  User.findById(_id)
    .then((user) => {
      if (!user) {
        console.log("User not found")
        return res.status(404).send()
      }
      res.send(user)
      console.log("User fetched:", user)
    })
    .catch((error) => {
      console.log("Error fetching user:", error)
      res.status(500).send()
    })
})

router.patch("/user/:id", (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ["name", "email", "password", "age"]
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    console.log("Invalid updates attempted:", updates)
    return res.status(400).send({ error: "Invalid updates!" })
  }

  const _id = req.params.id
  console.log(`Updating user with ID: ${_id}`)
  User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        console.log("User not found for update")
        return res.status(404).send()
      }
      res.send(user)
      console.log("User updated:", user)
    })
    .catch((error) => {
      console.log("Error updating user:", error)
      res.status(400).send(error)
    })
})

router.delete("/user/:id", (req, res) => {
  const _id = req.params.id
  console.log(`Deleting user with ID: ${_id}`)
  User.findByIdAndDelete(_id)
    .then((user) => {
      if (!user) {
        console.log("User not found for deletion")
        return res.status(404).send()
      }
      res.send(user)
      console.log("User deleted:", user)
    })
    .catch((error) => {
      console.log("Error deleting user:", error)
      res.status(500).send()
    })
})
