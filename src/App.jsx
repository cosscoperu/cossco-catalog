import React,{useMemo,useState,useEffect} from 'react'
import Header from './components/Header.jsx'
import ProductGrid from './components/ProductGrid.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import AboutSection from './components/AboutSection.jsx'
import Footer from './components/Footer.jsx'
import productsData from './data/products.json'
export default function App(){
  const [query,setQuery]=useState('')
  const [cart,setCart]=useState([])
  const [welcome,setWelcome]=useState(true)
  useEffect(()=>{const t=setTimeout(()=>setWelcome(false),2000);return()=>clearTimeout(t)},[])
  const products=useMemo(()=>{const q=query.trim().toLowerCase();return productsData.filter(p=>!q||String(p.title).toLowerCase().includes(q))},[query])
  function addToCart(item){setCart(prev=>{const i=prev.findIndex(x=>x.title===item.title);if(i>=0){const c=[...prev];c[i]={...c[i],qty:c[i].qty+1};return c}return[...prev,{...item,qty:1}]})}
  function removeFromCart(title){setCart(prev=>prev.filter(p=>p.title!==title))}
  function changeQty(title,qty){setCart(prev=>prev.map(p=>p.title===title?{...p,qty:Math.max(1,qty)}:p))}
  return (<div className="min-h-screen bg-marfil text-grafito">
    <Header query={query} setQuery={setQuery}/>
    {welcome&&(<div className="mx-auto max-w-6xl px-4 pt-3"><div className="rounded-xl border border-plateado/40 bg-white p-3 text-center shadow-suave"><div className="font-semibold text-dorado">Bienvenido a COSSCO — Solo productos de lujo</div></div></div>)}
    <main className="mx-auto max-w-6xl p-4"><ProductGrid products={products} onAdd={addToCart}/></main>
    <AboutSection/><Footer/>
    <CartDrawer cart={cart} onRemove={removeFromCart} onQty={changeQty}/>
  </div>)}
