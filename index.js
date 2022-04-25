const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();

// middleware.
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.yzmha.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const prodcutCollection = client.db("emajohn").collection("products");
    //get user

    app.get("/product", async (req, res) => {
      console.log("query", req.query);
      const size = parseInt(req.query.size);
      const page = parseInt(req.query.page);
      const query = {};
      const cursor = prodcutCollection.find(query);
      let products;
      if (page || size) {
        products = await cursor
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await cursor.toArray();
      }

      res.send(products);
    });
    //count data
    app.get("/productCount", async (req, res) => {
      const count = await prodcutCollection.countDocuments();
      res.send({ count });
    });

    //use post to get product by ids
    app.post("/productByKeys", async (req, res) => {
      const keys = req.body;
      const ids = keys.map((id) => ObjectId(id));
      const query = { _id: { $in: ids } };
      const cursor = prodcutCollection.find(query);
      const prodcut = await cursor.toArray();
      res.send(prodcut);
    });
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Welcome to the emajhon server");
});
app.listen(port, () => {
  console.log("port is  running", port);
});
