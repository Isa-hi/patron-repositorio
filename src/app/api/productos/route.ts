import { NextRequest, NextResponse } from "next/server";
import { UnitOfWork } from "@/lib/unitOfWork/UnitOfWork";
import { Producto } from "@/lib/models/Producto";

// Se instancia el UnitOfWork
const uow = new UnitOfWork();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const producto = new Producto(Number(data.id), data.nombre, Number(data.precio));
  
  // Registra el nuevo producto en el UnitOfWork
  uow.registerNew(producto);
  
  // Realiza el commit para aplicar y persistir todos los cambios pendientes
  await uow.commit();
  
  return NextResponse.json({ message: "Producto agregado mediante UnitOfWork" });
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const producto = new Producto(Number(data.id), data.nombre, Number(data.precio));
  
  // Registra la actualización del producto
  uow.registerUpdated(producto);
  await uow.commit();
  
  return NextResponse.json({ message: "Producto actualizado mediante UnitOfWork" });
}

export async function DELETE(req: NextRequest) {
  // Suponiendo que el id viene como parámetro de consulta (query)
  const id = Number(req.nextUrl.searchParams.get("id"));
  
  // Registra la eliminación del producto
  uow.registerDeleted(id);
  await uow.commit();
  
  return NextResponse.json({ message: "Producto eliminado mediante UnitOfWork" });
}
