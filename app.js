import "dotenv/config";
import express from "express";
import cors from "cors";
import createError from "http-errors";
import mongoose from "mongoose";
import dns from "dns";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

// importar rutas
import indexRoutes from "./routes/index.js";
import actividadesRoutes from "./routes/actividades.js";
import predicasRoutes from "./routes/predicas.js";
import contactRoutes from "./routes/contact.js";
import categoriesRoutes from "./routes/categories.js";
import calendarioRoutes from "./routes/calendario.js"; 

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
app.get("/img/:filename", (req, res) => {
  const filePath = join(__dirname, "public", "img", req.params.filename);
  if (fs.existsSync(filePath)) {
    const ext = filePath.split('.').pop();
    const contentTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    res.setHeader('Content-Type', contentTypes[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.status(404).json({ message: "imagen no encontrada" });
  }
});

// CORS - acepta cualquier origen vercel.app, localhost o el FRONT_URL exacto
const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders: "Authorization",
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// rutas principales
app.use("/", indexRoutes);
app.use("/predicas", predicasRoutes);
app.use("/actividades", actividadesRoutes);
app.use("/categories", categoriesRoutes);
app.use("/contact", contactRoutes);
app.use("/calendario-image", calendarioRoutes);
app.use("/calendario-upload", calendarioRoutes);
app.use("/calendario-delete", calendarioRoutes);

// manejo de errores 404
app.use((req, res, next) => {
  next(createError(404, "ruta no encontrada"));
});

// manejo general de errores
app.use((err, req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(err.status || 500).json({
    message: err.message || "error en el servidor",
  });
});

// conecta a la base de datos con cache para serverless
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

mongoose.set("bufferTimeoutMS", 30000);

const connectDb = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const directNodes = [
      "ac-culjato-shard-00-00.u3h8tkc.mongodb.net:27017",
      "ac-culjato-shard-00-01.u3h8tkc.mongodb.net:27017",
      "ac-culjato-shard-00-02.u3h8tkc.mongodb.net:27017",
    ];
    const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@${directNodes.join(",")}/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=app`;
    console.log("Connecting to MongoDB (direct)...");
    cached.promise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    }).then((m) => {
      cached.conn = m;
      console.log("Database connected");
      return m;
    }).catch((err) => {
      console.error("Database not connected:", err.message);
      cached.promise = null;
      throw err;
    });
  }
  return cached.promise;
};

// inicia conexión al cargar el módulo (antes de cualquier request)
connectDb().catch(() => {});

app.listen(app.get("port"), () => {
  console.log(`Servidor corriendo en el puerto ${app.get("port")}`);
});

export default app;