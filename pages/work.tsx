import Navbar from "@/components/Navbar"
import JudulPage from "@/components/JudulPage"
import { ParallaxProvider } from 'react-scroll-parallax';

export default function Work() {
    return (
        <div>
            < Navbar/>

            <ParallaxProvider>
                <JudulPage judul="Work" />
            </ParallaxProvider>
            
            <div className='my-96 text-transparent'>a</div>
            <div className='my-96 text-transparent'>a</div>
        </div>
    )
}