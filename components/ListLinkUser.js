import { getLinksUser } from '@/firebase/client'
import { useEffect, useState } from 'react'
import LinkUser from './LinkUser'

export default function ListLinkUser (props) {
  const [links, setLinks] = useState(null)

  useEffect(() => {
    const getLinks = async () => {
      const response = await getLinksUser(props.uid)
      console.log(response.length)
      return response
    }
    getLinks().then(resp => {
      setLinks(resp)
      console.log(resp)
    })
  }, [props.uid])

  return (
    <div className="border-t-[1px] my-4 dark:border-black">
      <h1 className="text-center font-semibold text-lg my-2 dark:text-white">Link compartidos</h1>
      {
        links !== null
          ? (
              links.map((doc) => (
                <LinkUser key={doc.id} pathFiles={doc.pathFiles} description={doc.description} id={doc.id} createdAt={doc.createdAt} countDownload={doc.downloadsCount} links={links} setLinks={setLinks}/>
              ))
            )
          : (
            <div className='dark:text-white' >Sorry, nada que mostrar</div>
            )
      }

    </div>
  )
}
