import React from 'react'
export default function AboutSection(){
  return (<section className="mt-12 border-t border-plateado/30 bg-white">
    <div className="mx-auto max-w-6xl p-6">
      <div className="rounded-2xl bg-dorado/10 p-6 ring-1 ring-dorado/40">
        <div className="mb-2 text-xl font-semibold">Sobre COSSCO</div>
        <p className="text-sm leading-relaxed text-grafito/90">
          COSSCO es una empresa importadora comprometida con la calidad, innovación y el diseño.
          Ofrecemos productos modernos que se adaptan a las necesidades de nuestros clientes.
        </p>
      </div>
    </div>
  </section>)
}