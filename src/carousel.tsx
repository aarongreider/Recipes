import { useState } from 'react'


interface CarouselProps {
    images: string[]
}

function Carousel({ images }: CarouselProps) {
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    let buttonStyle = {
        verticalAlign: 'top',
        font: '900 16px / 1.20 Alegreya Sans, Arial, Helvetica, sans-serif',
        color: '#30553a',
        borderRadius: '10px',
        border: 'none',
        boxShadow: ' 4px 4px 2px 0 rgba(77, 77, 77, .22)',
        textDecoration: 'none',
        background: 'linear-gradient(to bottom, #f3de54 0%, #e2b733 100%)',
        padding: '10px 15px',
    }

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '50vh', maxHeight: '350px', width: '100%', position: 'relative' }}>
            <button onClick={prevImage} style={buttonStyle}>{`<`}</button>

            <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} style={{ height: '100%', objectFit: 'contain', borderRadius:'12px' }} />
            <button onClick={nextImage} style={buttonStyle}>{`>`}</button>

        </div>
    )
}

export default Carousel