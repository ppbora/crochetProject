import {type Request} from "express"

export const loginSchema = {
    username:{
        notEmpty: {
            errorMessage:"Username is required"
        }
    },
    password:{
        notEmpty: {
            errorMessage:"Password is required"
        }
    }
}

export const regisSchema = {
    username:{
        notEmpty: {
            errorMessage:"Username is required"
        }
    },
    password:{
        notEmpty: {
            errorMessage:"Password is required"
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            },
            errorMessage: "Password must be at least 8 characters and contain an uppercase letter, a number, and a symbol"
        }
    },
}