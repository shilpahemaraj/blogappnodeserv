import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import path from 'path';
// data to build vote mechanism (this is to build backend logic without connecting to DB)
// const articlesInfo = {
//   "learn-react": {
//     upvotes: 0,
//     comments: [],
//   },
//   "learn-java": {
//     upvotes: 0,
//     comments: [],
//   },
//   "learn-node": {
//     upvotes: 0,
//     comments: [],
//   },
// };

//Reusing function - Extracted DB connections to use it in all the API calls.
const withDB = async (operations, res) =>{
  try {
    const client = await MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser : true})
    const db = client.db('blogappnodeserv');
  
    await operations(db) ;
  
    client.close();
  }catch(error){
    res.status(500).json({message : 'Error connecting to db', error});
  }
}

const app = express();

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.json());

// Test api calls
// app.get("/hello", (req, res) => res.send("Hello!"));
// app.get("/hello/:name", (req, res) => res.send(`Hello ${req.params.name}!`));
// app.post("/hello", (req, res) => res.send(`Hello ${req.body.name}`));

// Get articles based on name
app.get('/api/articles/:name', async (req,res) =>{

  withDB(async (db) => {
    const articleName = req.params.name;
    const articleInfo = await db.collection('articles').findOne({name:articleName});
    res.status(200).json(articleInfo);
  
  }, res)
})

// Adding upvote
app.post("/api/articles/:name/upvote", async (req, res) => {

  withDB(async(db) =>{
    const articleName = req.params.name;
    const articleInfo = await db.collection('articles').findOne({name:articleName});
  
    await db.collection('articles').updateOne({name:articleName},
      { $set: { upvotes:articleInfo.upvotes+1,} });
  
      const updatedArticleInfo = await db.collection('articles').findOne({name:articleName});
  
      res.status(200).json(updatedArticleInfo);
  
  }, res)
});

// Adding comments
app.post("/api/articles/:name/comment", (req, res) => {

  const { username, text } = req.body;
  const articleName = req.params.name;

  withDB(async(db)=>{
    const articleInfo = await db.collection('articles').findOne({name:articleName});

    await db.collection('articles').updateOne({name:articleName},
    { $set: { comments:articleInfo.comments.concat({username,text})} });

    const updatedArticleInfo = await db.collection('articles').findOne({name:articleName});

    res.status(200).json(updatedArticleInfo);
  },res); 
});

app.get('*',(req,res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
})
app.listen(8000, () => console.log("Listening on port 8000"));
