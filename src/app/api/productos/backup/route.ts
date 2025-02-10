// src/app/api/productos/backup/route.ts
import { NextResponse } from "next/server";
import { BackupService } from "@/lib/services/BackupService";
import { XMLStorage } from "@/lib/storage/XMLStorage";
import { UnitOfWork } from "@/lib/unitOfWork/UnitOfWork";

export async function POST() {
  // 1. Instanciar el UnitOfWork y realizar el commit
  const uow = new UnitOfWork();
  await uow.commit(); // Esto persiste todos los cambios pendientes

  // 2. Ejecutar la operación de backup
  // (Se puede usar una nueva instancia de XMLStorage para BackupService, 
  //  ya que el commit ya actualizó el almacén)
  const backupService = new BackupService(new XMLStorage());
  await backupService.backupAndSort();

  return NextResponse.json({ message: "Backup realizado con éxito." });
}
