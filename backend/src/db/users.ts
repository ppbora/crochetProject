import UserModel,{getUserByUsername,createUser,} from "./schemas/users-schemas.ts";

 export const saveUserLocal = async(name:string, username:string, password:string, gender:string)=>{
    try{
        const findUser = await getUserByUsername(username);
        
        if(!findUser) {
            return await createUser({name, username,password,gender,login:"local"});
        } else {
            throw new Error("Username is not available");
        }
    } catch(err){
        console.error("THE REAL DATABASE ERROR:", err);
        throw new Error("Error while saving user");
    }
}