import { redirect } from "next/navigation";

export default async function AdminAlias({
  params,
}: {
  params: Promise<{ params?: string[] }>;
}) {
  const { params: segments = [] } = await params;
  redirect(`/keystatic${segments.length ? `/${segments.join("/")}` : ""}`);
}
