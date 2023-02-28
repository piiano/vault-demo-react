import { Container } from '../components/Container'
import { Footer } from '../components/Footer'
import { Header } from '../components/Header'

function Error({ error }) {
  return (
    <div>Error: {error.message}</div>
  )
}


export function AppLayout({ error, children }) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-1 py-12">
        <Container className="flex-1 flex flex-col">
          {
            error ? <Error error={error} /> :
            children
          }
        </Container>
      </main>
      <Footer/>
    </div>
  )
}
