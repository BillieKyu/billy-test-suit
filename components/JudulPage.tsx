import { ParallaxBanner } from 'react-scroll-parallax';

export default function JudulPage({ judul }: any) {
  return (
    <ParallaxBanner
      className="overflow-hidden w-screen clip-triangle"
      layers={[
        {
          image: '/background.jpg',
          speed: -30
        },
      ]}
      style={{
        height: '50vh',
      }}
    >
      <div className="relative w-screen z-10 h-5/6 flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold">{judul}</h1>
        <p className="text-xl font-medium">Where all our great things begin</p>
      </div>
    </ParallaxBanner>
  );
}
