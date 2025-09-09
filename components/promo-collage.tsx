"use client"

export default function PromoCollage() {
  return (
    <section className="bg-[#f9f5f0] py-8 md:py-12">
      <div className="container mx-auto px-3 md:px-4">
        {/* Mobile Layout */}
        <div className="block lg:hidden space-y-2">
          {/* First image - Vertical rectangle */}
          <div className="relative rounded-lg overflow-hidden aspect-[4/5] w-full">
            <div className="absolute top-3 left-3 bg-[#ff8fab] text-white text-xs px-2 py-1 rounded z-10">
              Chaandi Uphar
            </div>
            <img 
              src="/Generated Image September 01, 2025 - 9_58PM.jpeg" 
              alt="Woman wearing elegant jewelry" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Horizontal rectangle */}
          <div className="relative rounded-lg overflow-hidden aspect-[16/9] w-full bg-[#f0e6d8]">
            <img 
              src="/brand.jpg" 
              alt="Gold jewelry" 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Two square images */}
          <div className="grid grid-cols-2 gap-2">
            <div className="relative rounded-lg overflow-hidden aspect-square bg-[#e6d8f0]">
              <img 
                src="/Untitled design (10).png" 
                alt="Luxury jewelry" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-square bg-[#f0e6d8]">
              <img 
                src="/New Ring.jpeg" 
                alt="Luxury jewelry" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block">
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
                src="/brand.jpg" 
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
        </div>
      </div>

      <style jsx>{`
        /* Desktop Only Styles */
        @media (min-width: 1024px) {
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
        }
      `}</style>
    </section>
  )
}
