import dynamic from 'next/dynamic'
import Head from 'next/head'

const InspectionTool = dynamic(
  () => import('../components/InspectionTool'),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <Head>
        <title>ReclaimTool</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <InspectionTool />
    </>
  )
}
