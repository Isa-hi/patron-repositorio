import { XMLStorage } from "@/lib/storage/XMLStorage";
import { xmlParser } from "@/utils/xmlParser";
import { Producto } from "@/lib/models/Producto";

export class BackupService {
  private storage: XMLStorage;

  constructor(storage: XMLStorage) {
    this.storage = storage;
  }

  async backupAndSort(): Promise<void> {
    console.log("Iniciando proceso de respaldo...");
    
    // 1️⃣ Leer el almacenamiento actual
    const productos: Producto[] = await this.storage.read();
    console.log(`Productos obtenidos: ${productos.length}`);

    // 2️⃣ Ordenar los productos por ID
    const productosOrdenados = productos.sort((a, b) => a.id - b.id);
    console.log("Productos ordenados por ID.");

    // 3️⃣ Guardar la copia de seguridad ordenada
    const backupFilePath = await this.storage.saveBackup(productosOrdenados);
    console.log(`Backup guardado en: ${backupFilePath}`);

    // 4️⃣ Actualizar el almacén con la versión ordenada
    await this.storage.save(productosOrdenados);
    console.log("Almacén actualizado con la versión ordenada.");
  }
}
