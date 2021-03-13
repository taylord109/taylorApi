import { Schema } from 'mongoose'

export const FileSchema = new Schema({
    id: { type: String },
    filename: { type: String },
    thumbnail: { type: String },
    path: { type: String },
    accessable: { type: Array<string>() },
})