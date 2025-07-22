import dynamic from 'next/dynamic'

// load the tool only on client
const InspectionTool = dynamic(
  () => import('../components/InspectionTool'),
  { ssr: false }
)

export default function Home() {
  return <InspectionTool />
}
