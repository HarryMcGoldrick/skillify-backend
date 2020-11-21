import { createHash, Hash } from 'crypto';
import { model } from 'mongoose';
import { userSchema } from '../schemas/user-schema';

const userModel = model('User', userSchema);


export const getHashedPassword = (password: string): string => {
    const sha256 = createHash('SHA256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

export const saveUserToDatabase = (username: string, password: string): string => {
   const userInstance = new userModel({username, password});
   userInstance.save();
   return userInstance._id;
}

export const hasExistingUsername = async (username: string): Promise<boolean> => {
    return userModel.exists({username});
}

export const getUserFromDatabase = async (username: string, password: string): Promise<any> => {
    return userModel.findOne({username, password});
}
