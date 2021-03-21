import { Schema } from 'mongoose'

export const FileSchema = new Schema({
    id: { type: String },
    filename: { type: String },
    path: { type: String },
    thumbnail: { type: String },
    supported: { type: String },
    accessable: { type: Array<string>() },
})