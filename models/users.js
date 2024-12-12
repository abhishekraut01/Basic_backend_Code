const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique : true,
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    }
})

const userModel = mongoose.model('users', userSchema)

module.exports = userModel;

// export the model for use in other files.  
//This allows us to use User in other files by requiring this module.  
//This is a best practice for creating reusable code.  
//In this case, other files might be something like routes, controllers, or services.  
//The userModel is a service that provides methods for interacting with the user collection in MongoDB.  
//This is a good example of how to create a reusable and scalable