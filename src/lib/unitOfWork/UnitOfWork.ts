// src/lib/unitOfWork/UnitOfWork.ts
import { Producto } from "@/lib/models/Producto";
import { ProductRepository } from "@/lib/repositories/ProductRepository";
import { XMLStorage } from "@/lib/storage/XMLStorage";

/**
 * UnitOfWork que agrupa operaciones sobre productos para realizar un commit conjunto.
 */
export class UnitOfWork {
  public productRepository: ProductRepository;

  // Listas para almacenar operaciones pendientes.
  private newEntities: Producto[] = [];
  private updatedEntities: Producto[] = [];
  private deletedEntityIds: number[] = [];

  constructor() {
    // Se comparte la misma instancia de XMLStorage en todo el UnitOfWork.
    this.productRepository = new ProductRepository(new XMLStorage());
  }

  /**
   * Registra un nuevo producto para inserción.
   */
  registerNew(producto: Producto): void {
    this.newEntities.push(producto);
  }

  /**
   * Registra un producto para actualización.
   */
  registerUpdated(producto: Producto): void {
    this.updatedEntities.push(producto);
  }

  /**
   * Registra el ID de un producto para eliminación.
   */
  registerDeleted(id: number): void {
    this.deletedEntityIds.push(id);
  }

  /**
   * Realiza el commit de todas las operaciones registradas.
   * 1. Carga el estado actual.
   * 2. Aplica inserciones, actualizaciones y eliminaciones.
   * 3. Ordena el listado final y lo persiste.
   */
  async commit(): Promise<void> {
    // 1. Cargar los datos actuales
    const currentProducts = await this.productRepository.getAll();
    let finalProducts: Producto[] = [...currentProducts];

    // 2. Aplicar inserciones: evitar duplicados por id.
    for (const newEntity of this.newEntities) {
      if (!finalProducts.find(p => p.id === newEntity.id)) {
        finalProducts.push(newEntity);
      } else {
        // Opcional: podrías decidir actualizar o rechazar la inserción.
        console.warn(`El producto con id ${newEntity.id} ya existe.`);
      }
    }

    // 3. Aplicar actualizaciones: reemplazar producto existente.
    for (const updatedEntity of this.updatedEntities) {
      const index = finalProducts.findIndex(p => p.id === updatedEntity.id);
      if (index !== -1) {
        finalProducts[index] = updatedEntity;
      } else {
        console.warn(`No se encontró producto con id ${updatedEntity.id} para actualizar.`);
      }
    }

    // 4. Aplicar eliminaciones.
    finalProducts = finalProducts.filter(p => !this.deletedEntityIds.includes(p.id));

    // 5. Ordenar la lista final por id.
    finalProducts.sort((a, b) => a.id - b.id);

    // 6. Persistir el conjunto final en el almacén.
    await this.productRepository.saveData(finalProducts);

    // 7. Limpiar las listas de operaciones.
    this.newEntities = [];
    this.updatedEntities = [];
    this.deletedEntityIds = [];
  }
}
