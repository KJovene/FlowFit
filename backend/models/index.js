import User from "./User.js";
import Exercise from "./Exercise.js";
import Session from "./Session.js";
import SessionExercise from "./SessionExercise.js";
import SessionRating from "./SessionRating.js";

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

// Relations avec User pour tracer les créateurs
Session.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

Exercise.belongsTo(User, {
  foreignKey: "createdBy",
  as: "creator",
});

User.hasMany(Session, {
  foreignKey: "createdBy",
  as: "sessions",
});

User.hasMany(Exercise, {
  foreignKey: "createdBy",
  as: "exercises",
});

// Relations pour les notes de séances
SessionRating.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

SessionRating.belongsTo(Session, {
  foreignKey: "sessionId",
  as: "session",
});

Session.hasMany(SessionRating, {
  foreignKey: "sessionId",
  as: "ratings",
});

User.hasMany(SessionRating, {
  foreignKey: "userId",
  as: "ratings",
});

export { User, Exercise, Session, SessionExercise, SessionRating };
