import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../Models/User';
import AppDataSource from '..';

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // let SK = process.env.SECRET_KEY;
    if(process.env.SECRET_KEY){
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne(decodedToken.userId);

        if (!user) {
        return res.status(401).json({ message: 'User not found' });
        }

        if(req.body.user !== null){
            req.body.user = user;
            next();
        }else{
          return res.status(401).json({message: 'User not found'});
        }
    }
        

    
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const authenticateRecruiter = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // let SK = process.env.SECRET_KEY;
    if(process.env.SECRET_KEY){
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY) as JwtPayload;
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne(decodedToken.userId);

        if (!user) {
        return res.status(401).json({ message: 'User not found' });
        }

        if(req.body.user !== null){
          if(user.role == 'recruiter'){
            req.body.user = user;
            next();
          }
          
        }
    }
        

    
    
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
