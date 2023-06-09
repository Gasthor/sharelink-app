import Button from '@/components/Button'
import { addLink, uploadFiles } from '@/firebase/client'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { getDownloadURL } from 'firebase/storage'
import { Alert, Progress } from '@material-tailwind/react'
import ConnectionStatus from '@/components/ConnectionStatus'
import useUser from '@/hooks/useUser'

export default function Home () {
  const [message, setMessage] = useState('')
  const user = useUser()
  const [link, setLink] = useState(null)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  const [files, setFiles] = useState(null)

  const [task, setTask] = useState(null)
  const [uploading, setUploading] = useState(0)
  // const [img, setImg] = useState(null)

  useEffect(() => {
    function updateIndicator () {
      console.log(window.navigator.onLine)
    }
    window.addEventListener('online', updateIndicator)
    const onProgress = () => {
      const progress = Math.trunc((task.snapshot.bytesTransferred / task.snapshot.totalBytes) * 100)
      setUploading(progress)
    }
    const onError = (error) => {
      <Alert>Error desconocido: {error}</Alert>
    }
    const onComplete = () => {
      getDownloadURL(task.snapshot.ref).then((downloadURL) => {
        upLink(downloadURL)
      })
    }
    if (task) {
      task.on('state_changed', onProgress, onError, onComplete)
    }
  }, [task])

  const upLink = async (dato) => {
    // averiguar porque da null esta mierdaaaa await setImg(dato)
    let userId = 'Anonimo'
    console.log(user)
    if (user !== null) {
      userId = user.uid
    }
    const response = await addLink(message, dato, userId)
    setLink(response)
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!link) {
      setLoading(true)
      const response = uploadFiles(files)
      setTask(response)
    }
  }
  const clipboard = () => {
    navigator.clipboard.writeText('https://sharelink-app.vercel.app/' + link)
    setCopied(true)
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

        <div className="flex justify-center mx-auto">

          <div className="m-1 p-2 bg-white w-11/12 max-w-lg rounded-xl dark:bg-gray-900">
            <h1 className="my-4 text-xl font-medium text-center dark:text-white">Arrastra los archivos a compartir</h1>
            <form onSubmit={handleSubmit}>
              <label>
                <div
                  type="file"
                  value=""
                  placeholder='Arrastra tus archivos en esta zona'
                  rows="6"
                  className='w-full py-4 resize-none text-center rounded-lg shadow-lg bg-gray-200 placeholder:text-center dark:bg-gray-800 dark:text-white'
                >
                  Apretar aqui para subir archivo
                </div>
                <input id="dropzone-file" type="file" className='hidden' onChange={e => setFiles(e.target.files[0])} />
              </label>
              <div className='my-4'>
                <h1 className='text-center dark:text-white'>Archivo seleccionado:</h1>
                {
                  files
                    ? <h1 className='text-sm text-center dark:text-white'>{files.name}</h1>
                    : <h1 className='text-sm text-center dark:text-white'>Ningun archivo seleccionado</h1>
                }
              </div>
              <input className='bg-gray-200 my-1 w-full p-1 rounded-lg shadow-lg dark:text-white dark:bg-gray-800' placeholder='Agrega una descripcion (OPCIONAL)' value={message} onChange={e => setMessage(e.target.value)} />
              {
                loading &&
                <Progress value={uploading} label={'Subiendo...'} />

              }
              <div className="flex justify-center flex-col">
                {
                  link
                    ? <div className='flex justify-center flex-col m-2 text-center'>
                      <h1 className='text-lg'>Link generado con exito</h1>
                      <h1 className='text-sm border-[2px] p-1 rounded-lg border-green-500 my-2'>https://sharelink-app.vercel.app/{link}</h1>

                      <div className='flex justify-center'>
                        <Button onClick={clipboard} colorBg="bg-green-500">
                          {
                            !copied ? <h1>Copiar link</h1> : <h1>Link copiado!!!</h1>
                          }
                        </Button>
                      </div>
                    </div>
                    : <div className='flex justify-center'>
                      <Button colorBg="bg-green-500" disabled={loading || !files}>
                        {
                          loading &&
                          <svg className="animate-spin h-5 w-5 mr-3 border-2 rounded-full border-t-transparent border-black" viewBox="0 0 24 24" />
                        }
                        <h1>Generar Link</h1>
                      </Button>
                    </div>
                }
              </div>
            </form>
          </div>
        </div>
        <div className='flex justify-center font-semibold'>
          <div className='flex flex-col'>
          <ConnectionStatus/>
          </div>

        </div>

      </>
    </>
  )
}
