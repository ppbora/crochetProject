
import {prop, getModelForClass} from "@typegoose/typegoose";

class Users{
    @prop({type: () => String})
    public name?:string; //both valus or undefined
    @prop({required:true, unique: true,type: () => String})
    public username!: string //need to have a value
    @prop({required:true,type: () => String})
    public password!: string
    @prop({type: () => String})
    public refreshToken?: string;
}

const UserModel = getModelForClass(Users);

export default UserModel;