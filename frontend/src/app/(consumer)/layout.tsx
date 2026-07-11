import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/Footer";

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* Add pt-[160px] here. Adjust the pixel value until it perfectly clears the header */}
      <main className="pt-[var(--header-height-mobile)] lg:pt-[var(--header-height-desktop)]">
        {children}
      </main>

      <Footer />
    </div>
  );
}
