"use client";

import { useState, useEffect } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: number;
};

export default function Home() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [id, setId] = useState("");

  // Cargar productos al inicio
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al obtener productos:", error));
  }, []);

  // Agregar producto
  const handleAgregar = async () => {
    if (!nombre || !precio) return alert("Completa todos los campos");

    const response = await fetch("/api/productos", {
      method: "POST",
      body: JSON.stringify({ nombre, precio: parseFloat(precio) }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      const nuevoProducto = await response.json();
      setProductos([...productos, nuevoProducto]);
      setNombre("");
      setPrecio("");
    } else {
      alert("Error al agregar producto");
    }
  };

  // Actualizar producto
  const handleActualizar = async () => {
    if (!id || !nombre || !precio) return alert("Completa todos los campos");

    const response = await fetch(`/api/productos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ nombre, precio: parseFloat(precio) }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      setProductos(
        productos.map((p) =>
          p.id === parseInt(id) ? { ...p, nombre, precio: parseFloat(precio) } : p
        )
      );
      setId("");
      setNombre("");
      setPrecio("");
    } else {
      alert("Error al actualizar producto");
    }
  };

  // Eliminar producto
  const handleEliminar = async (productoId: number) => {
    const response = await fetch(`/api/productos/${productoId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setProductos(productos.filter((p) => p.id !== productoId));
    } else {
      alert("Error al eliminar producto");
    }
  };

  // Realizar backup
  const handleBackup = async () => {
    const response = await fetch("/api/productos/backup", { method: "POST" });

    if (response.ok) {
      alert("Backup realizado con éxito");
    } else {
      alert("Error al realizar backup");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Productos</h1>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2"
          type="text"
          placeholder="ID (para actualizar)"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          className="border p-2"
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          className="border p-2"
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" onClick={handleAgregar}>
          Agregar
        </button>
        <button className="bg-yellow-500 text-white p-2" onClick={handleActualizar}>
          Actualizar
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.id}</td>
              <td className="border p-2">{p.nombre}</td>
              <td className="border p-2">${p.precio}</td>
              <td className="border p-2">
                <button
                  className="bg-red-500 text-white p-1"
                  onClick={() => handleEliminar(p.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="bg-green-500 text-white p-2 mt-4" onClick={handleBackup}>
        Realizar Backup
      </button>
    </div>
  );
}
