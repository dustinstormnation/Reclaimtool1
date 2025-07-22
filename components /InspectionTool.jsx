import dynamic from 'next/dynamic';

const InspectionTool = dynamic(
  () => import('../components/InspectionTool'),
  { ssr: false }
);

export default function Home() {
  return <InspectionTool />;
}
