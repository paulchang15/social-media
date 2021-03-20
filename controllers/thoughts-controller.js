const { Thought, User } = require("../models");

const thoughtController = {
  async getAllThought(req, res) {
    try {
      const allThoughts = await Thought.find({});

      if (!allThoughts) {
        res.status(404).json({ message: "No users were found!" });
      }
      res.json(allThoughts);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async getThoughtById({ params }, res) {
    try {
      const findThought = await Thought.findOne({ _id: params.id });
      if (!findThought) {
        res
          .status(404)
          .json({ message: "There are no thoughts with this id!" });
      }
      res.json(findThought);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  //   async addThought({ params, body }, res) {
  //     try {
  //       await Thought.create(body);
  //       const insertThought = await (() => {
  //         return User.findOneAndUpdate(
  //           { _id: params.userId },
  //           { $push: { thoughts: _id } },
  //           { new: true }
  //         );
  //       });

  //       if (!insertThought) {
  //         res
  //           .status(404)
  //           .json({ message: "There are no thoughts with this id!" });
  //       }
  //       res.json(insertThought);
  //     } catch (e) {
  //       console.log(e);
  //       res.status(400).json(e);
  //     }
  //   },
  addThought({ body }, res) {
    console.log("this is the body", body);
    Thought.create(body)
      .then((userId) => {
        console.log("This is the userId", userId);
        return User.findOneAndUpdate(
          { _id: body.userId },
          { $push: { thoughts: userId._id } },
          { new: true }
        );
      })
      .then((dbThought) => {
        if (!dbThought) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbThought);
      })
      .catch((err) => res.json(err));
  },
  async updateThought({ params, body }, res) {
    try {
      console.log("The params is", params);
      console.log("The body is", body);
      const updateThought = await Thought.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updateThought) {
        res
          .status(404)
          .json({ message: "There are no thoughts with this id!" });
      }
      res.json(updateThought);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async deleteThought({ params }, res) {
    try {
      // delete the thought id
      const delThought = await Thought.findOneAndDelete({ _id: params.id });

      //   const delFromUser = await updateUser(() => {
      //     if (!delThought) {
      //       res.status(404).json({ message: "No thought found with this ID" });
      //     }
      //     return User.findOneAndUpdate(
      //       { _id: params.userId },
      //       { $pull: { thoughts: params.thoughtsId } },
      //       { new: true }
      //     );
      //   });

      //   const

      res.json(delThought);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async addReaction({ params, body }, res) {
    try {
      const newReaction = await Thought.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
      );
      if (!newReaction) {
        res
          .status(404)
          .json({ message: "No thought found with this ID to add reaction!" });
      }
      res.json(newReaction);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async removeReaction({ params }, res) {
    try {
      console.log("This be the params", params);
      const delReaction = await Thought.findByIdAndUpdate(
        { _id: params.thoughtId },
        { $pull: { reactions: { reactionId: params.reactionId } } },
        { new: true }
      );
      if (!delReaction) {
        res.status(404).json({
          message: "No thought found with this ID to remove reaction!",
        });
      }
      res.json(delReaction);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },
};

module.exports = thoughtController;
