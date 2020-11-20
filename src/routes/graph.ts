import * as express from "express";

const router = express.Router();

router.post('/', function(req, res) {
    console.log(req.body.elements)
    res.json({ message: req.body });
  });

export default router;