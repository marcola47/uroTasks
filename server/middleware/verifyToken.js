import jwt from 'jsonwebtoken';

export default function verifyToken(req, res, next)
{
  const token = req.headers["x-access-token"];

  if (!token)
    res.send("No token found.")

  else
  {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>
    {
      if (err)
        res.send({ auth: false, message: "Authentication failed" });

      else
        req.userID = decoded.id;
        next();
    })
  }
}