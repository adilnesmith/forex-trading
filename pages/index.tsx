import Head from 'next/head'
import Forex from '@/components/forex'
import { APP_AUTHOR, APP_DESCRIPTION, APP_TITLE } from '@/lib/constant'


export default function Home() {
  return (
    <>
      <Head>
        <title>{APP_TITLE}</title>
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="author" content={APP_AUTHOR} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Forex />
    </>
  )
}
