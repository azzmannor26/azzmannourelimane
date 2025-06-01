const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Course = require("./models/course");
const CourseData = require("./courses.json");

dotenv.config();

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Course.deleteMany(); // vide la collection
    await Course.insertMany(CourseData); // insère les nouveaux cours

    console.log("✅ Données importées avec succès !");
    process.exit();
  } catch (error) {
    console.error("❌ Erreur d'import :", error);
    process.exit(1);
  }
};

importData();
