const express = require("express")
const User = require("../models/user.model")
const auth = require("../middlewares/auth.mid")
const multer = require("multer")
const router = new express.Router()

// Endpoints for Users
router.post("/user", (req, res) => {
  console.log("Creating user...")
  const user = new User(req.body)
  user
    .save()
    .then(() => {
      const token = user.generateAuthToken()
      res.status(201).send({ user, token })
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

router.post("/user/login", auth, async (req, res) => {
  try {
    const { email, password } = req.body
    console.log(`Logging in user with email: ${email}`)
    const user = await User.findByCredentials(email, password)

    if (!user) {
      return res.status(401).send({ error: "Login failed!" })
    }
    res.send({
      user: user.getPublicProfile(),
      token: await user.generateAuthToken(),
    })
    console.log("User logged in:", user.getPublicProfile())
  } catch (error) {
    console.log("Error logging in user:", error)
    res.status(500).send()
  }
})

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch (error) {
    res.status(500).send()
  }
})

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user)
})

router.get("/user/:id", auth, async (req, res) => {
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

const upload = multer({ dest: "avatars", limits: { fileSize: 1000000 }, fileFilter(req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Please upload an image file (jpg, jpeg, png)"))
  }
  cb(undefined, true)
}})

router.post("/user/me/avatar", upload.single('avatar'), async (req, res) => {
  res.send()
})

module.exports = router
