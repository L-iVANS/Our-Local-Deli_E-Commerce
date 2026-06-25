import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header forceTheme="A" />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}