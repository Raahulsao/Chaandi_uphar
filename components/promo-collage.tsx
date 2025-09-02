"use client"

export default function PromoCollage() {
  // Define exact card sizes for reference
  const cardSizes = {
    leftCard: { width: 837, height: 790 }, // Left tall card
    topRightCard: { width: 837, height: 383 }, // Top-right card
    bottomLeftCard: { width: 406, height: 383 }, // Bottom-left card
    bottomRightCard: { width: 406, height: 383 }, // Bottom-right card
  };

  return (
    <section className="bg-[#f9f5f0]">
      <div className="gallery">
        {/* Left big card */}
        <div className="card-left relative rounded-lg overflow-hidden">
          <div className="absolute top-3 left-3 bg-[#ff8fab] text-white text-xs px-2 py-1 rounded">
            Chaandi Uphar
          </div>
          <img 
            src="/Generated Image September 01, 2025 - 9_58PM.jpeg" 
            alt="Woman wearing elegant jewelry" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right top card */}
        <div className="card-right-top relative rounded-lg overflow-hidden bg-[#f0e6d8]">
          <img 
            src="/18-kt-jew-desktop.webp" 
            alt="Gold jewelry" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Bottom right two cards */}
        <div className="card-right-bottom">
          {/* Bottom left card */}
          <div className="relative rounded-lg overflow-hidden bg-[#e6d8f0]">
            <img 
              src="/Untitled design (10).png" 
              alt="Luxury jewelry" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Bottom right card */}
          <div className="relative rounded-lg overflow-hidden bg-[#f0e6d8]">
            <img 
              src="/New Ring.jpeg" 
              alt="Luxury jewelry" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery { 
          width: 100%;               /* Full width */
          max-width: 1500px;         /* Increased max-width */
          height: 628px; 
          margin: 0 auto;            /* Center the gallery */
          display: grid; 
          grid-template-columns: 645px 790px; /* Further increased widths */
          grid-template-rows: 314px 314px; 
          gap: 5px; 
          justify-content: center;   /* Center grid items horizontally */
          align-items: center;       /* Center grid items vertically */
        } 
        
        /* Left big card */ 
        .card-left { 
          width: 645px;              /* Further increased width */
          height: 628px; 
          grid-row: 1 / span 2; 
          grid-column: 1; 
          margin: auto;              /* Center the card */
        } 
        
        /* Right top card */ 
        .card-right-top { 
          width: 790px;              /* Further increased width */
          height: 313px; 
          grid-row: 1; 
          grid-column: 2; 
          margin: auto;              /* Center the card */
        } 
        
        /* Bottom right two cards */ 
        .card-right-bottom { 
          display: grid; 
          grid-template-columns: 393px 393px; /* Further increased widths */
          gap: 5px; 
          grid-row: 2; 
          grid-column: 2; 
          height: 313px;             /* Match the row height */
          margin: auto;              /* Center the container */
          justify-content: center;   /* Center the cards horizontally */
        }
      `}</style>
    </section>
  )
}
