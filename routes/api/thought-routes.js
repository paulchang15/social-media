const router = require("express").Router();

const {
  getAllThought,
  getThoughtById,
  addThought,
  updateThought,
  deleteThought,
  addReaction,
  removeReaction,
} = require("../../controllers/thoughts-controller");

// /thoughts
// Need to go back to thoughts-controller and rethink the addThoughts to be able to actually push into userID
router.route("/").get(getAllThought);

// /thoughts/<userId>
router.route("/:userId").post(addThought);

// /thoughts/<userId>/<thoughtId>
router
  .route("/:userId/:id")
  .get(getThoughtById)
  .put(updateThought)
  .delete(deleteThought);

// deleting specifically one thought that isn't tied to a User
router.route("/:id").delete(deleteThought);

router.route("/:thoughtId").put(addReaction);
// /thoughts/<thoughtId>/<reactionId>
router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
