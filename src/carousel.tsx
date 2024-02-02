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
        <div style={{ display:'flex',alignItems:'center', justifyContent:'flex-end', maxHeight: '450px', maxWidth: '650px',width:'82vw', position:'relative'}}>
            <button onClick={prevImage} style={{}}>{`<`}</button>
            
            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} style={{ width: '80%', objectFit: 'contain' }}/>
            <button onClick={nextImage} style={{}}>{`>`}</button>
            
        </div>
    )
}

export default Carousel