import { Hero } from '../components/Hero'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

export default function Home() {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center">
        <Hero />
      </main>
      <Footer/>
    </div>
  )
}
