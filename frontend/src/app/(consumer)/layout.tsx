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
      <main className="min-h-screen pt-[140px] sm:pt-[180px]">{children}</main>

      <Footer />
    </div>
  );
}
