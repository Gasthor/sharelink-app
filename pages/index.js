import Button from '@/components/Button'
import { addLink } from '@/firebase/client'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Home () {
  const [message, setMessage] = useState('')
  const [link, setLink] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!link) {
      const link = await addLink(message)
      setLink(link)
    }
  }
  const clipboard = () => {
    console.log(link)
    navigator.clipboard.writeText(link)
  }

  return (
    <>
      <Head>
        <title>ShareLink 🤝</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <h1 className='m-6 text-center text-2xl font-semibold'>Compartir tus archivos nunca fue tan facil!!</h1>
        <div className="flex justify-center">
          <div className="m-1 p-2 bg-white rounded-xl max-w-3xl">
            <h1 className="my-4 text-xl text-center">Arrastra los archivos a compartir</h1>
            <form onSubmit={handleSubmit}>
              <div className=" flex items-center justify-center w-full my-2">
                <label htmlFor="dropzone-file" className="shadow-lg flex flex-col items-center justify-center w-full h-64 p-2 border-2 border-blue-500 border-dashed rounded-lg cursor-pointer bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg aria-hidden="true" className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm "><span className="font-semibold">Click para seleccionar archivos</span> o arrastra y suelta en esta zona</p>
                    <p className="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400pxxxxx)</p>
                  </div>
                  <input id="dropzone-file" type="file" className="hidden" />
                </label>
              </div>
              <input className='bg-slate-200 my-1 w-full p-1 rounded-lg border-[1px] border-blue-500' placeholder='Agrega una descripcion (OPCIONAL)' value={message} onChange={e => setMessage(e.target.value)} />
              <div className="flex justify-center">
                {
                  link
                    ? <div className='flex justify-center flex-col m-2 text-center'>
                    <h1 className='text-lg'>Link generado con exito</h1>
                    <h1 className='text-sm'>https://sharelink-app.vercel.app/{link}</h1>
                    <Button onClick={clipboard} colorBg="bg-green-500">
                      Copiar link
                    </Button>
                    </div>
                    : <Button colorBg="bg-green-500" disabled={message.length === 0}>
                      <h1>Generar Link</h1>
                    </Button>
                }

              </div>
            </form>
          </div>
        </div>
        <div className='flex justify-center font-semibold'>
          <Link className='m-2 text-xs text-red-500' href='/report'>Reportar un problema</Link>
        </div>

      </>
    </>
  )
}
