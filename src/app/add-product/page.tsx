import FormSubmitButton from "@/components/FormSubmitButton";
import prisma from "@/lib/db/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export const metadata = { title: "Add Product - Pixazon" };
const addProduct = async (formData: FormData) => {
  "use server";
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const imageUrl = formData.get("imageUrl")?.toString();
  const price = Number(formData.get("price" || 0));
  if (!name || !description || !imageUrl || !price) {
    throw Error("Missing required fields");
  }

  redirect("/");
};
export default async function AddProductPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/add-product");
  }
  return (
    <>
      <h1 className="mb-3 text-lg font-bold">Add Product</h1>
      <form action={addProduct} className="">
        <input
          required
          type="text"
          name="name"
          placeholder="Name"
          className="input input-bordered mb-3 w-full"
        />

        <textarea
          name="description"
          id=""
          placeholder="Description"
          required
          className="textarea textarea-bordered mb-3 w-full"
        />
        <input
          name="imageUrl"
          id=""
          placeholder="Image URL"
          required
          type="url"
          className="input input-bordered mb-3 w-full"
        />
        <input
          name="price"
          id=""
          placeholder="Price"
          required
          type="number"
          className="input input-bordered mb-3 w-full"
        />

        <FormSubmitButton className="btn-block">Add Product</FormSubmitButton>
      </form>
    </>
  );
}
