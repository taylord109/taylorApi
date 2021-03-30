import { Schema } from 'mongoose'

export const UserSchema = new Schema({
    id: { type: String },
    username: { type: String },
    password: { type: String },
})