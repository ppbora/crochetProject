export const createNameValidationSchema ={
    name:{
        isLength:{
            option:{
                min:5,
                max:32
            },
            errorMessage:
                "name must be between 5 to 32 chars."
        },
        notEmpty: {
            errorMessage: "Name cannot be empty.",
        },
        isString: {
            errorMessage: "Name must be string.",
        },
    },
    realname:{
        notEmpty: {
            errorMessage: "Real Name cannot be empty.",
        },
    },
}

export const queryValidationSchema={
    filter:{
        notEmpty: {
            errorMessage: "Filter cannot be empty.",
        },
        isString: {
            errorMessage: "Filter must be string.",
        },
    }
}