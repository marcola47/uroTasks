import jwt from 'jsonwebtoken';

export function verifyHeaderToken(req, res, next)
{
  const token = req.headers["x-access-token"];

  if (!token)
    res.send("No token found.")

  else
  {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
    {
      if (err)
        res.status(400).send({ auth: false, message: "Authentication failed" });

      else
      {
        req.userID = decoded.id;
        next();
      }
    })
  }
}

export function verifyBodyToken(req, res, next)
{
  const token = req.body.token;

  if (!token)
    res.status(400).send({ auth: false, message: "No authentication token found, cannot proceed." })

  else
  {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
    {
      if (err)
        res.status(400).send({ auth: false, message: "Failed to authenticate token" });

      else
        next();
    })
  }
}