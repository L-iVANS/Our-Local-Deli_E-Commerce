import CatalogContainer from "../../../features/public/catalog/CatalogContainer";
import { getSession } from "../../../lib/session";

export const metadata = {
  title: "Full Catalog | Omega Houseware",
  description: "Browse our extensive collection of premium houseware products.",
};

export default async function CatalogPage() {
  const initialUser = await getSession();

  return <CatalogContainer initialUser={initialUser} />;
}
