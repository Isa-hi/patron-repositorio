import fs from "fs/promises";
import path from "path";
import { xmlParser } from "@/utils/xmlParser";
import { Producto } from "@/lib/models/Producto";

const STORAGE_PATH = path.join(process.cwd(), "data", "productos.xml");
const BACKUP_PATH = path.join(process.cwd(), "data", "backup.xml");

export class XMLStorage {
  async read(): Promise<Producto[]> {
    try {
      const data = await fs.readFile(STORAGE_PATH, "utf-8");
      return xmlParser.parse(data);
    } catch (error) {
      console.error("Error al leer el archivo XML:", error);
      return [];
    }
  }

  async save(productos: Producto[]): Promise<void> {
    try {
      const xmlData = xmlParser.stringify(productos);
      await fs.writeFile(STORAGE_PATH, xmlData, "utf-8");
      console.log("Datos guardados correctamente en XML.");
    } catch (error) {
      console.error("Error al guardar en XML:", error);
    }
  }

  async saveBackup(productos: Producto[]): Promise<string> {
    try {
      const xmlData = xmlParser.stringify(productos);
      await fs.writeFile(BACKUP_PATH, xmlData, "utf-8");
      console.log("Backup guardado correctamente.");
      return BACKUP_PATH;
    } catch (error) {
      console.error("Error al guardar el backup:", error);
      throw error;
    }
  }
}
