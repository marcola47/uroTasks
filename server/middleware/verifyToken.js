import jwt from 'jsonwebtoken';
import Token from '../models/Token.js';

export default function verifyToken(req, res, next)
{
  const accessToken = req.body.accessToken;
  const reqType = req.body.reqType;

  if (!accessToken)
    return res.status(400).send({ auth: false, message: "You are not currently authtenticated. Please, log in to continue." })

  jwt.verify(accessToken, process.env.JWT_ACCESS, (accessError, accessDecoded) =>
  {
    if (accessError && accessError.name === 'TokenExpiredError')
    {
      const refreshToken = req.body.refreshToken;

      if (!refreshToken)
        return res.status(400).send({ auth: false, message: "You are not currently authtenticated. Please, log in to continue." })
      
      jwt.verify(refreshToken, process.env.JWT_REFRESH, async (refreshError, refreshDecoded) => 
      {
        if (refreshError)
          return res.status(400).send({ auth: false, message: "Your current session expired. Please, log in to continue." })
          
        if (await Token.findOne({ token: refreshToken, userID: refreshDecoded.id }))
        {
          const newAccessToken = jwt.sign({ id: refreshDecoded.id }, process.env.JWT_ACCESS, { expiresIn: '15s' })
          req.newAccessToken = newAccessToken;
        
          if (reqType === 'login')
            req.body.userID = refreshDecoded.id;
        
          next();
        }

        else
          return res.status(401).send({ auth: false, message: "Failed to authenticate access token. Please, log in to continue." })
      })
    }

    else if (accessError)
      return res.status(401).send({ auth: false, message: "Failed to authenticate access token. Please, log in to continue." })

    else
    {
      if (reqType === 'login')
        req.body.userID = accessDecoded.id;

      next();
    }
  })
}