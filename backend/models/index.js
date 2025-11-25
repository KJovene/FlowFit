import User from "./User.js";
import Exercise from "./Exercise.js";
import Session from "./Session.js";
import SessionExercise from "./SessionExercise.js";

// Définir les associations
Session.belongsToMany(Exercise, {
  through: SessionExercise,
  foreignKey: "sessionId",
  otherKey: "exerciseId",
  as: "exercises",
});

Exercise.belongsToMany(Session, {
  through: SessionExercise,
  foreignKey: "exerciseId",
  otherKey: "sessionId",
  as: "sessions",
});

Session.hasMany(SessionExercise, {
  foreignKey: "sessionId",
  as: "sessionExercises",
});

SessionExercise.belongsTo(Session, {
  foreignKey: "sessionId",
});

SessionExercise.belongsTo(Exercise, {
  foreignKey: "exerciseId",
  as: "exercise",
});

export { User, Exercise, Session, SessionExercise };
