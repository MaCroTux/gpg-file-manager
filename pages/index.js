import Head from 'next/head'

export default function Home() {
  return (
    <div className='container'>
      <Head>
        <title>GPG Encritp file</title>
        <meta name="description" content="Secure storage encrypt using GPG" />
        <link rel="icon" href="/favicon.ico" />
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" 
          rel="stylesheet" 
          integrity="sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We" 
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"/>
      </Head>

      <main>
        <h1>GPG Encript file</h1>
        <div className="list-group">
            <a href="#" className="list-group-item list-group-item-action active" aria-current="true">
              File encrypt history
            </a>            
            <div className='list'>            
            </div>
          </div>
      </main>

      <footer style={{textAlign: 'center'}}>
        <span className="badge bg-light text-dark">
          Powered by <a href="https://github.com/MaCroTux">MaCroTux</a>
        </span>        
      </footer>
    </div>
  )
}
