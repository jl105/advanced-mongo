const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;

const uri = "mongodb+srv://jilinda10:liaNg331*)@cluster0.f4ghe7b.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const databaseName = 'sample_mflix';
const collName = 'comments'

module.exports = {}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/find/
module.exports.getAllComments = async (movieId)=>{

  const database = client.db(databaseName);
  const comments = database.collection(collName);

  const query = {movie_id: ObjectId(movieId)};
  let commentCursor = await comments.find(query).limit(10).project({name: 1, text: 1}).sort({runtime: -1});

  if (commentCursor) {
    return commentCursor.toArray();
  } else {
    return {error: `No item found with identifier ${commentIdOrMovieId}.`}
  }
}

// https://www.mongodb.com/docs/drivers/node/current/usage-examples/findOne/
module.exports.getCommentByCommentIdOrMovieId = async (commentId) => {
  const database = client.db(databaseName);
  const comments = database.collection(collName);
  let query = {_id: ObjectId(commentId)};
  let comment = await comments.findOne(query);

  if (comment) {
    return comment;
  } else {
    return {error: `No item found with identifier ${commentIdOrMovieId}.`}
  }
}


// https://www.mongodb.com/docs/v4.4/tutorial/insert-documents/
module.exports.createComment = async (movie_id, newObj) => {
  const database = client.db(databaseName);
  const comments = database.collection(collName);

  if(!newObj.text || !movie_id){
    // Invalid movie object, shouldn't go in database.
    return {error: "Comments must have a text and a movie id associated with it."};
  }

  const movies = database.collection("movies");
  const query = {_id: ObjectId(movie_id)};
  let movieExist = await movies.findOne(query);
  if (!movieExist) {
    return {error: "Movie must exist for the commented to be inserted for."};
  }
  let result = await comments.insertOne({"_id": newObj.id, "text": newObj.text, "email": newObj.email, "movie_id": ObjectId(movie_id),"date": newObj.date});
  if(result.acknowledged){
    return { newObjectId: result.insertedId, message: `Item created! ID: ${result.insertedId}` }
  } else {
    return {error: "Something went wrong. Please try again."}
  }
}


// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/change-a-document/
module.exports.updateCommentById = async (commentId, newObj) => {
  const database = client.db(databaseName);
  const comments = database.collection(collName);

  // Product team says only these two fields can be updated.
  const updateRules = {
    $set: {"name" : newObj.name, "email": newObj.email, "text": newObj.text, "date": newObj.date}
  };
  const filter = { _id: ObjectId(commentId) };
  const result = await comments.updateOne(filter, updateRules);

  if(result.modifiedCount != 1){
    return {error: `Something went wrong. ${result.modifiedCount} movies were updated. Please try again.`}
  };

  const updatedComment = module.exports.getCommentByCommentIdOrMovieId(commentId);
  return updatedComment;
}

// https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/write-operations/delete/
module.exports.deleteCommentById = async (commentId) => {
  const database = client.db(databaseName);
  const movies = database.collection(collName);

  const deletionRules = {_id:ObjectId(commentId)}
  const result = await movies.deleteOne(deletionRules);

  if(result.deletedCount != 1){
    return {error: `Something went wrong. ${result.deletedCount} movies were deleted. Please try again.`}
  };

  return {message: `Deleted ${result.deletedCount} comment ${commentId}.`};
}











