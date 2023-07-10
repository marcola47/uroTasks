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
          const newAccessToken = jwt.sign({ id: refreshDecoded.id }, process.env.JWT_ACCESS, { expiresIn: '1m' })
          req.body.accessToken = newAccessToken;
        
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

// debugging version
// export default function verifyToken(req, res, next)
// {
//   const accessToken = req.body.accessToken;
//   const reqType = req.body.reqType;

//   console.log("getting access token and req type from body...")

//   if (!accessToken)
//   {
//     console.log("access token not found")
//     return res.status(400).send({ auth: false, message: "You are not currently authtenticated. Please, log in to continue." })
//   }

//   jwt.verify(accessToken, process.env.JWT_ACCESS, (accessError, accessDecoded) =>
//   {
//     console.log("verifying access token...")

//     if (accessError && accessError.name === 'TokenExpiredError')
//     {
//       console.log("access token is expired... getting refresh token from body")
//       const refreshToken = req.body.refreshToken;

//       if (!refreshToken)
//       {
//         console.log("refresh token not found")
//         return res.status(400).send({ auth: false, message: "You are not currently authtenticated. Please, log in to continue." })
//       }

//       jwt.verify(refreshToken, process.env.JWT_REFRESH, async (refreshError, refreshDecoded) => 
//       {
//         console.log("verifying refresh token...")

//         if (refreshError)
//         {
//           console.log("failed to validate refresh token")
//           return res.status(400).send({ auth: false, message: "Your current session expired. Please, log in to continue." })
//         }

//         if (await Token.findOne({ token: refreshToken, userID: refreshDecoded.id }))
//         {
//           console.log("refresh token found in the database")

//           const newAccessToken = jwt.sign({ id: refreshDecoded.id }, process.env.JWT_ACCESS, { expiresIn: '1m' })
//           req.body.accessToken = newAccessToken;

//           if (reqType === 'login')
//             req.body.userID = refreshDecoded.id;

//           console.log("refresh token validated. executing next function.")
//           next();
//         }

//         else
//         {
//           console.log("refresh token not found in the database")
//           return res.status(401).send({ auth: false, message: "Failed to authenticate access token. Please, log in to continue." })
//         }
//       })
//     }

//     else if (accessError)
//     {
//       console.log("failed to validate refresh token")
//       return res.status(401).send({ auth: false, message: "Failed to authenticate access token. Please, log in to continue." })
//     }

//     else
//     {
//       if (reqType === 'login')
//         req.body.userID = accessDecoded.id;

//       console.log("access token validated. executing next function.")
//       next();
//     }
//   })
// }