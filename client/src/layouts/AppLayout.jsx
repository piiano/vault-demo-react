import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'
import VaultBanner from '../components/VaultBanner';

export function AppLayout({ children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header className="border-b" />
      <VaultBanner />
      <main className="flex-1 py-12">
        <Container className="flex-1 flex flex-col">
          { children }
        </Container>
      </main>
      <Footer />
    </div>
  )
}
