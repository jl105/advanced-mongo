const { Router } = require("express");
const router = Router();

const movieData = require('../dataInterface/movies');

// curl http://localhost:5001/movies
router.get("/", async (req, res, next) => {
  let movieList = await movieData.getAll()

  if(movieList){
    res.status(200).send(movieList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles either id or title as an identifier.
// curl http://localhost:5001/movies/573a1390f29313caabcd4135
// curl http://localhost:5001/movies/Jurassic%20Park
router.get("/:id", async (req, res, next) => {
  const result = await movieData.getByIdOrTitle(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);

});

// // GET ALL COMMENTS FOR A MOVIE
// router.get("/:id/comments", async(req, res) => {
//   const result = await movieData.getAllComments(req.params.id)
//   res.status(200).send(result);
// })

// curl -X POST -H "Content-Type: application/json" -d '{"title":"Llamas From Space", "plot":"Aliens..."}' http://localhost:5001/movies
router.post("/", async (req, res, next) => {
  let resultStatus;
  let result = await movieData.create(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// // CREATE A NEW COMMENT FOR A MOVIE
// router.post("/:id/comments", async(req, res) => {
//   const result = await movieData.createComment(req.params.id, req.body)
//   res.status(200).send(result);
// })

// curl -X PUT -H "Content-Type: application/json" -d '{"plot":"Sharks..."}' http://localhost:5001/movies/573a13a3f29313caabd0e77b
router.put("/:id", async (req, res, next) => {
  let resultStatus;
  const result = await movieData.updateById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X DELETE http://localhost:5001/movies/573a1390f29313caabcd4135
router.delete("/:id", async (req, res, next) => {
  const result = await movieData.deleteById(req.params.id);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// // DELETE A COMMENT
// router.delete("/:movieId/comments/:commentId", async(req, res)=>{
//   const result = await movieData.deleteCommentById(req.params.commentId)
//   res.status(200).send(result);
// })

//comment section starts


const commentData = require('../dataInterface/comments');

// curl http://localhost:5001/movies/:id/comments
// GET ALL COMMENTS FOR A MOVIE
//e.g. curl http://localhost:5001/movies/573a1397f29313caabce69db/comments
router.get("/:id/comments", async (req, res, next) => {
  let commentList = await commentData.getAllComments(req.params.id)

  if(commentList){
    res.status(200).send(commentList)
  } else {
    // If movieList is empty/null, something serious is wrong with the MongoDB connection.
    res.status(500).send({error: "Something went wrong. Please try again."})
  }
});

// This route handles comment id as an identifier.
// e.g. http://localhost:5001/movies/comments/5a9427648b0beebeb6957aa3
router.get("/comments/:id", async (req, res, next) => {
  const result = await commentData.getCommentByCommentIdOrMovieId(req.params.id)

  if(result.error){
    resultStatus = 404;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});


// curl -X POST -H "Content-Type: application/json" -d "{\"text\":\"MongoDB 2nd Test\", \"movie_id\":\"573a1397f29313caabce69db\"}" http://localhost:5001/movies/comments
router.post("/comments", async (req, res, next) => {
  let resultStatus;
  let result = await commentData.createComment(req.body);

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// CREATE A NEW COMMENT FOR A MOVIE
router.post("/:id/comments", async(req, res) => {
  const result = await commentData.createComment(req.params.id, req.body)
  res.status(200).send(result);
})

// curl -X PUT -H "Content-Type: application/json" -d "{\"text\":\"MongoDB 5th Test\"}" http://localhost:5001/movies/comments/62e0b359fed238f12b6a7d1c
router.put("/comments/:id", async (req, res, next) => {
  let resultStatus;
  const result = await commentData.updateCommentById(req.params.id, req.body)

  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
});

// curl -X DELETE http://localhost:5001/movies/573a1390f29313caabcd4135
// DELETE A COMMENT
router.delete("/comments/:id", async(req, res)=>{
  const result = await commentData.deleteCommentById(req.params.id)
  if(result.error){
    resultStatus = 400;
  } else {
    resultStatus = 200;
  }

  res.status(resultStatus).send(result);
})
//comment section ends
module.exports = router;

