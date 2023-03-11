import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/api", (req, res) => 
{
  res.json({ "users": ["one", "two", "three"] });
});

app.listen(PORT, () => {console.log(`server started runnig on port ${PORT}`)});