import express from "express";
const router = express.Router();

/* get home page. */
router.get("/", function (req, res) {
  res.status(200).send({ message: "API Works!" });
});


export default router;