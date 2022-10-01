const { Thought, User, Reaction } = require('../models');

module.exports = {
  // Get all courses
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a course
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thought
  createThought(req, res) {
    console.log(req.body)
    Thought.create(req.body)
      .then(async (thought) => {
        console.log(thought)
        await User.findOneAndUpdate({_id: req.body.userId},{$addToSet:{thoughts: thought._id}},{ runValidators: true, new: true })
            .then((user) =>{
                !user
                    ? res.status(404).json({ message: 'No user with that id' })
                    : res.json(thought)
            })
        })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a course
  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.updateMany({ thoughts: { $in: thought._id } },{ $pull: { thoughts: thought._id  } })
      )
      .then(() => res.json({ message: 'thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a course
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // add reaction
  addReaction(req,res) {
    console.log('You are adding an reaction');
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete reaction
  deleteReaction(req,res) {
    console.log('You are deleting an reaction');
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: req.body.reactionId } },
      { runValidators: true, new: true }
    )
    .then((thought) =>
    !thought
      ? res.status(404).json({
          message: 'No thought found with that id',
        })
      : res.json({ message: 'Reaction sucessfully deleted' })
  )
  .catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
  }
};
