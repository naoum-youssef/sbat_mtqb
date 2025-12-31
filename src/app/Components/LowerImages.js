import Image from 'next/image';

const LowerImages = () => {
    const images = [
        '/images/mtqb_lp2.png'
    ];

    return (
        <div className="flex flex-col">
            {images.map((image, index) => (
                <div key={index} className="w-full">
                    <Image
                        src={image}
                        alt={`Upper Image ${index + 1}`}
                        width={800}
                        height={600}
                        className="w-full h-auto block"
                        priority={index === 0}
                    />
                </div>
            ))}
        </div>
    );
};

export default LowerImages;