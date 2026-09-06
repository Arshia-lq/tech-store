import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="min-h-[70vh]">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
