const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

// console.log(process.env.PASS

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.3besjfn.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();

    const todoCollection = client.db("todo").collection("todos");






    app.get("/todos", async (req, res) => {
      let query = {};
      if (req.query?.priority) {
        query = { priority: req.query.priority };
      }

      const result = await todoCollection.find(query).toArray();

      res.send(result);
    });

    // update or put data
    app.put("/todos/:id", async (req, res) => {
      const todo = req.body;
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };

      const updateDoc = {
        $set: {
         title: todo.title,
         description: todo.description,
         isCompleted: todo.isCompleted,
         priority: todo.priority
        },
      };
      const result = await todoCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    // delete

    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await todoCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TODO APP");
});

app.listen(port, () => {
  console.log(`TODO APP listening on port ${port}`);
});
