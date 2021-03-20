const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: "You need a username!",
      trim: true,
    },
    email: {
      type: String,
      require: [true, "Please enter a valid email!"],
      unique: true,
      validate: {
        validator: function (v) {
          return /.+\@.+\..+/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Thought",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

UserSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("User", UserSchema);

module.exports = User;
