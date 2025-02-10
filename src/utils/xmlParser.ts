import { parseStringPromise, Builder } from "xml2js";
import { Producto } from "@/lib/models/Producto";

export const xmlParser = {
  async parse(xmlString: string): Promise<Producto[]> {
    const result = await parseStringPromise(xmlString);
    return result.productos?.producto?.map((p: any) => ({
      id: parseInt(p.id[0]),
      nombre: p.nombre[0],
      precio: parseFloat(p.precio[0])
    })) || [];
  },

  stringify(productos: Producto[]): string {
    const builder = new Builder();
    const xmlObj = { productos: { producto: productos } };
    return builder.buildObject(xmlObj);
  }
};
