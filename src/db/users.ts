import UserModel from "./schemas/users-schemas.ts";

 export const saveUserLocal = async(name:string, username:string, password:string, gender:string)=>{
    try{
        const findUser = await UserModel.findOne({username: username});
        
        if(!findUser) {
            const newUser = new UserModel({name, username,password,gender,login:"local"});
            const savedUser = await newUser.save();
            return savedUser;
        } else {
            throw new Error("Username is not available");
        }
    } catch(err){
        throw new Error("Error while saving user");
    }
}