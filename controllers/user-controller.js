const { User } = require("../models");

const userController = {
  //   async getAllUser(req, res) {
  //     try {
  //       const allUsers = await User.find({})
  //         .populate({
  //           path: "thoughts",
  //           select: "-__v",
  //         })
  //         .populate({
  //           path: "friends",
  //           select: "-__v",
  //         })
  //         .select("-__v");

  //       if (!allUsers) {
  //         res.status(404).json({ message: "No users were found!" });
  //       }
  //         res.json(allUsers);

  //     } catch (e) {
  //       console.log(e);
  //       res.status(400).json(e);
  //     }
  //   },

  getAllUser(req, res) {
    User.find({})
      .populate({
        path: "thoughts",
        select: "thoughtText reactions",
      })
      .populate({
        path: "friends",
        select: "-__v",
      })
      .select("-__v")
      .then((dbUser) => res.json(dbUser))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },
  async getUserById({ params }, res) {
    try {
      const findUser = await User.findOne({ _id: params.id })
        .populate({
          path: "thoughts",
          select: "-__v",
        })
        .populate({
          path: "friends",
          select: "-__v",
        })
        .select("-__v");
      if (!findUser) {
        res.status(404).json({ message: "There are no users with this id!" });
      } else {
        res.json(findUser);
      }
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },
  async createUser({ body }, res) {
    try {
      const newUser = await User.create(body);
      res.json(newUser);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },
  async updateUser({ params, body }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: params.id },
        body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        res.status(404).json({ message: "No user found with this ID" });
      }
      res.json(updatedUser);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async deleteUser({ params }, res) {
    try {
      const delUser = await User.findOneAndDelete({ _id: params.id });

      if (!delUser) {
        res.status(404).json({ message: "No user found with this ID" });
      }
      res.json(delUser);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async addFriend({ params }, res) {
    try {
      const newFriend = await User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
      );
      if (!newFriend) {
        res
          .status(404)
          .json({ message: "No user found with this ID to add friend!" });
        return;
      }
      res.json(newFriend);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },

  async removeFriend({ params }, res) {
    try {
      const delFriend = await User.findByIdAndUpdate(
        { _id: params.userId },
        { $pull: { friends: params.friendId } },
        { new: true }
      );
      if (!delFriend) {
        res.status(404).json({
          message: "No friend found with this Id!",
        });
      }
      res.json(delFriend);
    } catch (e) {
      console.log(e);
      res.status(400).json(e);
    }
  },
};

module.exports = userController;
