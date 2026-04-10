
import {prop, getModelForClass} from "@typegoose/typegoose";

class Users{
    @prop({type: () => String})
    public name?:string; //both valus or undefined

    @prop({type: () => String})
    public username?: string 

    @prop({type: () => String,select: false})
    public password?: string

    @prop({type: () => String})
    public gender?: string

    @prop({type: () => String})
    public email?: string;

    @prop({type: () => String, select: false})
    public refreshToken?: string;

    @prop({type: () => String})
    public discordId?: string;
    
    @prop({type: () => String})
    public googleId?: string;

    @prop({required:true, type: () => String})
    public login!: string;
}

const UserModel = getModelForClass(Users);

export default UserModel;

export const getUserByAccessToken = (accessToken:string)=> UserModel.findOne({
    'authentication.accessToken': accessToken,
})
export const getUserById = (id:string)=> UserModel.findById(id)
export const getUserByUsername = (username:string)=>UserModel.findOne({username: username})
export const createUser = (values: Record<string,any>)=> new UserModel(values)
    .save().then((user)=>user.toObject())