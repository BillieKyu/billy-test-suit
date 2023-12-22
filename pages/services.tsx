import Navbar from "@/components/Navbar"
import JudulPage from "@/components/JudulPage"
import { ParallaxProvider } from 'react-scroll-parallax';

export default function Services() {
    return (
        <div>
            < Navbar/>

            <ParallaxProvider>
                <JudulPage judul="Services" />
            </ParallaxProvider>
            
            <div className='my-96 text-transparent'>a</div>
            <div className='my-96 text-transparent'>a</div>
        </div>
    )
}