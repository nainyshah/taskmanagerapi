const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");

const router = new express.Router();
// get All Tasks/filtered
// GET /task?completed=true
// GET /task?limit=10&skip=20
// GET /task?sortBy=createdAt:desc
router.get("/tasks", auth, async (req, res) => {
  const match = {};
  const sort = {};
  if (req.query.completed) {
    match.completed = req.query.completed === "true";
  }
  // Sorting
  if (req.query.sort) {
    const part = req.query.sortBy.split(":");
    sort[part[0]] = part[1] === "desc" ? -1 : 1;
  }
  try {
    // const task = await Task.find({ owner: req.user._id });
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip)
        },
        sort
      })
      .execPopulate();
    res.status(200).send(req.user.tasks);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
// get Task By Id
router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findById(_id);
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
// delete task
router.delete("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  try {
    // const task = await Task.findByIdAndDelete(req.params.id);
    const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
    if (!task) {
      res.status(400).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
// update task
router.patch("/tasks/:id", auth, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["completed"];
    const isValidOperation = updates.every(update =>
      allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
      return res.status(400).send({ Error: "Not a valid update!" });
    }

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      res.status(404).send();
    }
    updates.forEach(update => (task[update] = req.body[update]));
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});
// Create Task Method
router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });

  try {
    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
  //   const task = new Task(req.body);

  //   task
  //     .save()
  //     .then(() => {
  //       res.status(201).send(task);
  //     })
  //     .catch(e => {
  //       res.status(400).send(e);
  //     });
});

module.exports = router;
