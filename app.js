import "dotenv/config";
import express from "express";
import cors from "cors";
import createError from "http-errors";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// importar rutas
import indexRoutes from "./routes/index.js";
import actividadesRoutes from "./routes/actividades.js";
import predicasRoutes from "./routes/predicas.js";
import contactRoutes from "./routes/contact.js";
import categoriesRoutes from "./routes/categories.js"; 

// inicializar app
const app = express();
app.set("port", process.env.PORT || 4000);

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// define __dirname para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// servir imágenes
app.use("/img", express.static(join(__dirname, "public", "img")));

// configuración de cors
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "local"
        ? [`http://${process.env.FRONT_URL}`]
        : [
            `https://${process.env.FRONT_URL}`,
            `https://www.${process.env.FRONT_URL}`,
          ],
    credentials: true,
    exposedHeaders: "Authorization",
  })
);

// rutas principales
app.use("/", indexRoutes);
app.use("/predicas", predicasRoutes);
app.use("/actividades", actividadesRoutes);
app.use("/categories", categoriesRoutes);
app.use("/contact", contactRoutes);

// manejo de errores 404
app.use((req, res, next) => {
  next(createError(404, "ruta no encontrada"));
});

// manejo general de errores
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message || "error en el servidor",
  });
});

// conecta a la base de datos y levanta servidor
const connectDb = async () => {
  try {
    // construimos la URL completa usando las variables separadas y agregando appName
    const mongoUri = `${process.env.DB_PROTOCOL}${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=app`;

    await mongoose.connect(mongoUri);
    console.log("Database connected");

    app.listen(app.get("port"), () => {
      console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
    });
  } catch (err) {
    console.error("Database not connected", err);
  }
};

connectDb();