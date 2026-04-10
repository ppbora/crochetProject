import UserModel from '../db/schemas/users-schemas.ts';

export function serializeUser(user: Express.User, done: (err: Error | null, id?: unknown) => void){
    console.log(`Inside Serialize User : ${user}`)
    done(null, user._id); //report back to Passport
};

export async function deserializeUser(id:string, done: (err: Error | null, user?: Express.User | false | null) => void) {
    console.log(`Inside Deserialize User : ${id}`)
    try {
        const findMember = await UserModel.findById(id)
        if(!findMember) return done(null, false)
        done(null, findMember);
    } catch(err){
        done(err as Error);
    }
};