const mongoose = require('mongoose')
const {isEmail} = require('validator')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: [true, "Can't be blank"],
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        require: [true, "Can't be blank"],
        index: true,
        validate: [isEmail, "invalid email"],
    },
    password: {
        type: String,
        require: [true, "Can't be blank"],
    },
    picture: {
        type: String,
    },
    newMessages: {
        type: Object,
        default: {},
    },
    status: {
        type: String,
        default: 'offline'
    },

}, {minimize: false})


UserSchema.pre('save', function(next) {
    const user = this
    if(!user.isModified('password')) return next()

    bcrypt.genSalt(10, (err,salt) => {
        if(err) return next(err)

        bcrypt.hash(user.password, salt, (err,hash) => {
            if(err) return next(err)
            
            user.password = hash 
            next()
        })
    })
})

UserSchema.methods.toJSON = function() {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    return userObject 
}


UserSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({email})
    if(!user) throw new Error('Invalid Email or Password')
    
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch) throw new Error('Invalid Email or Password')
    return user
}

const User = mongoose.model('User', UserSchema)

module.exports = User