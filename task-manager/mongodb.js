// CRUD operations for MongoDB

const { MongoClient } = require("mongodb") // Forma moderna de importar

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"

// Creamos una función async para poder usar 'await'
const main = async () => {
  let client // Definimos el cliente aquí para que sea accesible en el 'finally'

  try {
    // 1. Conectamos y esperamos a que la conexión se establezca
    client = await MongoClient.connect(connectionURL)
    console.log("Connected to the database!")

    const db = client.db(databaseName)
    const usersCollection = db.collection("users")

    // Opcional: Limpiamos la colección para evitar duplicados en cada ejecución
    await usersCollection.deleteMany({})

    // 2. Create (insertOne): esperamos a que la operación termine
    const insertOneResult = await usersCollection.insertOne({
      name: "Alice",
      age: 30,
    })
    console.log("User inserted with id:", insertOneResult.insertedId)

    // 3. Create (insertMany): con sintaxis corregida y esperamos a que termine
    const insertManyResult = await usersCollection.insertMany([
      { name: "Juan", age: 68 },
      { name: "Rayco", age: 28 },
      { name: "Fefo", age: 30 },
      { name: "Chaxi", age: 21 },
    ])
    console.log(`${insertManyResult.insertedCount} users were inserted.`)

    db.collection("tasks").insertMany([
      { description: "Clean the house", completed: true },
      { description: "Renew inspection", completed: false },
      { description: "Pot plants", completed: true },
    ]),
      (error, result) => {
        if (error) {
          return console.log("Unable to insert tasks")
        }
        console.log("Tasks inserted:", result.ops)
      }

    // 4. Read: esperamos a obtener el resultado
    const user = await usersCollection.findOne({ name: "Alice" })
    console.log("User fetched:", user)

    // 5. Update: esperamos a que se complete la actualización
    const updateResult = await usersCollection.updateOne(
      { name: "Alice" },
      { $set: { age: 31 } }
    )
    console.log(`${updateResult.modifiedCount} user(s) were updated.`)

    // 6. Delete: esperamos a que se borre el usuario
    const deleteResult = await usersCollection.deleteOne({ name: "Alice" })
    console.log(`${deleteResult.deletedCount} user(s) were deleted.`)
  } catch (error) {
    console.error("An error occurred:", error)
  } finally {
    // 7. MUY IMPORTANTE: Cerramos la conexión solo cuando todo ha terminado (o ha fallado)
    if (client) {
      await client.close()
      console.log("Connection closed.")
    }
  }
}

// Ejecutamos la función principal
main()
