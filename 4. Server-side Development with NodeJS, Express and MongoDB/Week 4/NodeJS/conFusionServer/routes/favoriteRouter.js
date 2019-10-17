const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Favorites = require("../models/favorite");
var authenticate = require("../authenticate");
const cors = require("./cors");
const Dishes = require("../models/dishes");
 
const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user._id })
      .populate("user")
      .populate("dishes")
      .then(
        user_Favorites => {
          if (user_Favorites[0] != null) {
            console.log(req.user._id);
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(user_Favorites[0]);
          } else {
            err = new Error("Favorites for this user not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({ user: req.user._id })
      .then(
        userFavorites => {
          if (userFavorites[0] != null) {
            Favorites.findByIdAndRemove(userFavorites[0]._id)
              .then(
                resp => {
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(resp);
                },
                err => next(err)
              )
              .catch(err => next(err));
          } else {
            err = new Error("User not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

favoriteRouter
  .route("/:dishId")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            if (req.params.dishId != null) {
              // first get the user ID
              req.body.user = req.user._id;
              // check for user favorites
              Favorites.find({ user: req.user._id })
                .then(
                  userFavorites => {
                    if (userFavorites[0] != null) {
                      var status = userFavorites[0].dishes.indexOf(
                        req.params.dishId
                      );
                      if (status === -1) {
                        userFavorites[0].dishes.push(req.params.dishId);
                        userFavorites[0].save().then(new_favorite => {
                          res.statusCode = 200;
                          res.setHeader("Content-Type", "application/json");
                          res.json(userFavorites[0]);
                        });
                      } else {
                        err = new Error(
                          "Dish " +
                            req.params.dishId +
                            " already included in your favorites"
                        );
                        err.status = 404;
                        return next(err);
                      }
                    } else {
                      // create new favorite
                      Favorites.create(req.body).then(
                        newfavorite => {
                          console.log(newfavorite); // update the new favorite by pushing dish id into the dishes array
                          newfavorite.dishes.push(req.params.dishId);
                          newfavorite.save().then(new_favorite => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(new_favorite);
                          });
                        },
                        err => next(err)
                      );
                    }
                  },
                  err => next(err)
                )
                .catch(err => next(err));
            }
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Dishes.findById(req.params.dishId)
      .then(
        dish => {
          if (dish != null) {
            if (req.params.dishId != null) {
              // first get the user ID
              req.body.user = req.user._id;

              // check for user favorites
              Favorites.find({ user: req.user._id })
                .then(
                  userFavorites => {
                    if (userFavorites[0] != null) {
                      Favorites.find({ user: req.user._id })
                        .then(
                          updatedFavorite => {
                            //updatedFavorite[0].save();
                            updatedFavorite[0].dishes.pull(req.params.dishId);
                            updatedFavorite[0].save();
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(updatedFavorite);
                          },
                          err => next(err)
                        )
                        .catch(err => next(err));
                    } else {
                      err = new Error("User not found");
                      err.status = 404;
                      return next(err);
                    }
                  },
                  err => next(err)
                )
                .catch(err => next(err));
            }
          } else {
            err = new Error("Dish " + req.params.dishId + " not found");
            err.status = 404;
            return next(err);
          }
        },
        err => next(err)
      )
      .catch(err => next(err));
  });

module.exports = favoriteRouter;
