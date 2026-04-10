import type { Profile } from "passport";
import type OAuth2Strategy from "passport-oauth2";
import UserModel from "../db/schemas/users-schemas.ts";

export const loginDiscord = async (accessToken:string, refreshToken:string,profile:Profile, done:OAuth2Strategy.VerifyCallback)=>{
    let findUser ;
    
    try{ 
        findUser = await UserModel.findOne({discordId: profile.id});
    } catch(err){
        return done(err);
    }

    try{
        if(!findUser) {
            const newUser = new UserModel({
                username: profile.username, 
                discordId: profile.id,
                login: "discord",
            })
            const newSavedUser = await newUser.save();
            return done(null, newSavedUser as Express.User);
        }
        return done (null, findUser as Express.User)
    } catch(err){
        console.log(err);
        return done(err);
    }
}

export const loginGoogle = async (accessToken:string, refreshToken:string,profile:Profile, done:OAuth2Strategy.VerifyCallback)=>{
    let findUser ;
    
    try{ 
        findUser = await UserModel.findOne({discordId: profile.id});
    } catch(err){
        return done(err);
    }

    try{
        if(!findUser) {
            const newUser = new UserModel({
                username: profile.username, 
                googleId: profile.id,
                login: "google",
            })
            const newSavedUser = await newUser.save();
            return done(null, newSavedUser as Express.User);
        }
        return done (null, findUser as Express.User)
    } catch(err){
        console.log(err);
        return done(err);
    }
}