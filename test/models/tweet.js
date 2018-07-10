'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const config = require('../config')
const mongoosastic = require('../../lib/mongoosastic')

// -- simplest indexing... index all fields
const UserSchema = new Schema({
  name: {type: String}
})

const TweetSchema = new Schema({
  name: {
    type: {
      fr: {type: String},
      en: {type: String},
      es: {type: String, es_indexed: true}
    },
    es_indexed: true
  },
  user: {type: String, es_indexed: true},
  userId: Number,
  post_date: Date,
  message: {type: String, es_indexed: true},
  logs: {
    type: [new mongoose.Schema({status: {type: String, es_indexed: true}, date: Date}, {
      _id: false,
      timestamp: false
    })]
  },
  log: {
    type: new mongoose.Schema({status: String, date: Date}, {
      _id: false,
      timestamp: false
    })
  },
  nested: {
    type: [new Schema({
      name: {
        type: String
      }
    })],
    es_indexed: true,
    es_type: 'nested',
    es_include_in_parent: true
  },
  author: {type: Schema.Types.ObjectId, ref: 'User', es_schema: UserSchema, es_indexed: true},
  otherAuthor: {type: Schema.Types.ObjectId, ref: 'User'},
  customsData: {}
})

TweetSchema.plugin(mongoosastic, {
  index: 'tweets',
  type: 'tweet',
  esClient: config.getClient()
})

module.exports = mongoose.model('Tweet', TweetSchema)
