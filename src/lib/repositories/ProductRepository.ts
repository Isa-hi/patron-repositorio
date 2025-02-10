import { XMLStorage } from "@/lib/storage/XMLStorage";
import { Producto } from "@/lib/models/Producto";

export class ProductRepository {
  private storage: XMLStorage;

  constructor(storage: XMLStorage) {
    this.storage = storage;
  }

  async getAll(): Promise<Producto[]> {
    return this.storage.read();
  }

  /**
   * Guarda un conjunto completo de productos en el almacén.
   * Con este método, el UnitOfWork podrá cargar el estado actual y luego aplicar en memoria todos los cambios,
   *  para finalmente persistirlos de forma conjunta.
   */
  async saveData(productos: Producto[]): Promise<void> {
    await this.storage.save(productos);
  }

  async insert(producto: Producto): Promise<void> {
    const productos = await this.storage.read();
    productos.push(producto);
    productos.sort((a, b) => a.id - b.id); // Inserción ordenada
    await this.storage.save(productos);
  }

  async update(producto: Producto): Promise<void> {
    let productos = await this.storage.read();
    productos = productos.map(p => (p.id === producto.id ? producto : p));
    await this.storage.save(productos);
  }

  async delete(id: number): Promise<void> {
    const productos = (await this.storage.read()).filter(p => p.id !== id);
    await this.storage.save(productos);
  }

  async findById(id: number): Promise<Producto | null> {
    return (await this.storage.read()).find(p => p.id === id) || null;
  }

  async findByName(nombre: string): Promise<Producto[]> {
    return (await this.storage.read()).filter(p => p.nombre.includes(nombre));
  }

  async findByPrice(precio: number): Promise<Producto[]> {
    return (await this.storage.read()).filter(p => p.precio === precio);
  }
}
