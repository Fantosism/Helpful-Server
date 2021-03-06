"use strict";
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");

const Following = require("../models/following");

const router = express.Router();

/* Jwt Auth */
const jwtAuth = passport.authenticate("jwt", { session: false });

/* Get All Follows Endpoint  */

router.get("/all", jwtAuth, (req, res, next) => {
    /* Validation */

    /*            */
    Following.findOne()
        .sort({ createdAt: "desc" })
        .then(follows => {
            res.json(follows);
        })
        .catch(err => {
            next(err);
        });
});

/* Get All Following Endpoint by userId */

router.get("/user", jwtAuth, (req, res, next) => {
    const id = req.user.id;
    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("The `id` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    Following.find({ userId: id })
        .sort({ createdAt: "desc" })
        .populate("organizationId")
        .then(follows => {
            res.json(follows);
        })
        .catch(err => {
            next(err);
        });
});

// endpoint to check if user is following specific org, return boolean
router.get("/following/:id", jwtAuth, (req, res, next) => {
    const orgId = req.params.id;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(orgId)) {
        const err = new Error("The `orgId` is not valid");
        err.status = 400;
        return next(err);
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const err = new Error("The `userId` is not valid");
        err.status = 400;
        return next(err);
    }

    Following.find({ organizationId: orgId, userId: userId })
        .then(follows => {
            if (follows[0]) {
                res.json(follows[0]);
            } else {
                res.json(false);
            }
        })
        .catch(err => {
            next(err);
        });
});
/* Get All Following Endpoint by orgId */

router.get("/org/:id", jwtAuth, (req, res, next) => {
    const id = req.params.id;
    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("The `id` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    Following.find({ organizationId: id })
        .sort({ createdAt: "desc" })
        .then(follows => {
            res.json(follows);
        })
        .catch(err => {
            next(err);
        });
});

/* Get Single Follow Endpoint  */

router.get("/:id", jwtAuth, (req, res, next) => {
    const id = req.params.id;
    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const err = new Error("The `id` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    Following.findOne({ _id: id })
        .sort({ createdAt: "desc" })
        .then(follows => {
            res.json(follows);
        })
        .catch(err => {
            next(err);
        });
});

/* Post New Follow Endpoint  */

router.post("/", jwtAuth, (req, res, next) => {
    const { orgId } = req.body;
    const userId = req.user.id;
    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        const err = new Error("The `User id` is not valid");
        err.status = 400;
        return next(err);
    }
    if (!mongoose.Types.ObjectId.isValid(orgId)) {
        const err = new Error("The `Organization id` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    const newFollow = { userId, following: true, organizationId: orgId };

    Following.create(newFollow)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            next(err);
        });
});

/* Put/Edit Follow Endpoint  */

router.put("/", jwtAuth, (req, res, next) => {
    const { followId, following } = req.body;

    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(followId)) {
        const err = new Error("The `id` is not valid");
        err.status = 400;
        return next(err);
    }
    if (typeof following !== Boolean) {
        const err = new Error("The `Follow input` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    Following.findOneAndUpdate({ _id: followId }, { following })
        .sort({ createdAt: "desc" })
        .then(follow => {
            res.json(follow);
        })
        .catch(err => {
            next(err);
        });
});

/* Delete Single Follow Endpoint  */

router.delete("/", jwtAuth, (req, res, next) => {
    const { followId } = req.body;
    /* Validation */
    if (!mongoose.Types.ObjectId.isValid(followId)) {
        const err = new Error("The `id` is not valid");
        err.status = 400;
        return next(err);
    }
    /*            */
    Following.findOneAndDelete({ _id: followId })
        .then(follow => {
            res.json(follow);
        })
        .catch(err => {
            next(err);
        });
});
module.exports = router;
