import { useState } from 'react'


interface CarouselProps {
    images: string[]
}

function Carousel({ images }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div style={{ display:'flex',alignItems:'center', justifyContent:'space-around', height:'50vh', maxHeight: '350px', width:'100%', position:'relative'}}>
            <button onClick={prevImage} style={{}}>{`<`}</button>
            
            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} style={{ height:'100%', objectFit: 'contain' }}/>
            <button onClick={nextImage} style={{}}>{`>`}</button>
            
        </div>
    )
}

export default Carousel