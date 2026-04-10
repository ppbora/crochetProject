import { configDotenv } from 'dotenv';
import path from 'path';

configDotenv({ path: path.resolve(import.meta.dirname, '../../.env') });
//PORT
const port = process.env.PORT || '8080'
if (!port) {
    throw new Error (`Error: Please specify the port`)
}


//MONGODB
const mongoDB = process.env.MONGO_DB
if (!mongoDB) {
    throw new Error (`Error: Please specify the MongoDB URL`)
}

const accessSecretKey = process.env.ACCESS_SECRET_KEY
if (!accessSecretKey) {
    throw new Error (`Error: Please specify the Secret Key`)
}

const refreshSecretKey = process.env.REFRESH_SECRET_KEY
if (!refreshSecretKey) {
    throw new Error (`Error: Please specify the Secret Key`)
}

const discordClientSecret = process.env.DISCORD_CLIENT_SECRET
if (!discordClientSecret) {
    throw new Error (`Error: Please specify the Discord Client Secret`)
}

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
if (!googleClientSecret) {
    throw new Error (`Error: Please specify the Google Client Secret`)
}

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
    throw new Error (`Error: Please specify the Session Secret`)
}

//constants .env
const env = {
    PORT: parseInt(port, 10),
    MONGO_DB: mongoDB,
    ACCESS_SECRET_KEY: accessSecretKey,
    REFRESH_SECRET_KEY: refreshSecretKey,
    DISCORD_CLIENT_SECRET: discordClientSecret,
    GOOGLE_CLIENT_SECRET: googleClientSecret,
    SESSION_SECRET: sessionSecret,
};

export default env;

//Pascal : ConfigDotEnv
//snake : pus_fdlsk