const Database = require("../../database.js");
const DB_PATH = "./database.db";

exports.addUserToLesson = async (req, res) => {
  const { userId, lessonId } = req.body;

  if (!userId || !lessonId) {
    return res.status(400).json({
      status: false,
      error: "Both userId and lessonId are required",
    });
  }

  try {
    const result = await Database.Write(
      DB_PATH,
      "INSERT INTO users_lessons (id_user, id_lesson) VALUES (?, ?)",
      userId,
      lessonId
    );

    if (result instanceof Error) {
      throw result;
    }

    return res.status(201).json({
      status: true,
      message: "User added to lesson successfully",
    });
  } catch (error) {
    console.error("Error adding user to lesson:", error);
    return res.status(500).json({
      status: false,
      error: "Internal server error while adding user to lesson",
    });
  }
};
