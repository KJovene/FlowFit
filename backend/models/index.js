import User from "./User.js";
import Exercise from "./Exercise.js";
import Session from "./Session.js";
import SessionExercise from "./SessionExercise.js";
import SessionRating from "./SessionRating.js";
import FavoriteSession from "./FavoriteSession.js";

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
  onDelete: "CASCADE",
});

SessionExercise.belongsTo(Session, {
  foreignKey: "sessionId",
  onDelete: "CASCADE",
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
  onDelete: "CASCADE",
});

Session.hasMany(SessionRating, {
  foreignKey: "sessionId",
  as: "ratings",
  onDelete: "CASCADE",
});

User.hasMany(SessionRating, {
  foreignKey: "userId",
  as: "ratings",
});

// Relations pour les favoris
FavoriteSession.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

FavoriteSession.belongsTo(Session, {
  foreignKey: "sessionId",
  as: "session",
  onDelete: "CASCADE",
});

User.hasMany(FavoriteSession, {
  foreignKey: "userId",
  as: "favoriteSessions",
});

Session.hasMany(FavoriteSession, {
  foreignKey: "sessionId",
  as: "favoritedBy",
  onDelete: "CASCADE",
});

export {
  User,
  Exercise,
  Session,
  SessionExercise,
  SessionRating,
  FavoriteSession,
};
