import React, {createContext, useContext, useEffect, useState}  from "react";
import { toast } from "react-hot-toast";


const Context = createContext()


export const StateContext =({children})=>{
    let item,price,quantity
    
   

    const [cartItems, setCartItems] = useState([])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            item = JSON.parse(localStorage.getItem('cartItems') || "[]")
            price = JSON.parse(localStorage.getItem('total') || "0")
            quantity = JSON.parse(localStorage.getItem('quantity') || "0")
           }
           setCartItems(item)
           setTotalQuantities(quantity)
           setTotalPrice(price)

           return ()=>{
            localStorage.setItem('cartItems','[]')
            localStorage.setItem('total','0')
            localStorage.setItem('quantity','0')
           }
      }, [])
    const [showCart, setShowCart] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantities, setTotalQuantities] = useState(0)
    const [qty, setQty] = useState(1)

   

    let foundProduct
    let index
    

    const onAdd = async(product, quantity)=>{
        const checkProductInCart = await cartItems.find(item => item._id === product._id)
        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price*quantity)
        setTotalQuantities(prevTotalQuantity =>{
            if(prevTotalQuantity < 0) return
            return prevTotalQuantity+quantity
        })
    
        if(checkProductInCart){
            const updatedCartItems = cartItems.map(cartProduct => {
                if(cartProduct._id === product._id) return{
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity
                }
            })
            setCartItems(updatedCartItems)
        }else{
            product.quantity = quantity
            setCartItems([...cartItems, {...product}])
        }
        toast.success(`${qty} ${product.name} added to cart`)
        // localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }


 

    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        localStorage.setItem('total', JSON.stringify(totalPrice))
        localStorage.setItem('quantity', JSON.stringify(totalQuantities))
        console.log(JSON.parse(localStorage.getItem('cartItems')))
      }, [cartItems])





    const onRemove = (id) =>{
        foundProduct = cartItems.find(item => item._id === id)
        const newCartItems = cartItems.filter((item) => item._id != id )
        setCartItems(newCartItems)
        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantities(prevTotalQuantity => {
            if(prevTotalQuantity == 0) return 0
           return prevTotalQuantity-foundProduct.quantity
        })
       
    }


    const toggleCartItemQuantity =(id, value)=>{
        foundProduct = cartItems.find(item => item._id === id)
        index =cartItems.findIndex(product =>product._id === id)
        
        if(value === 'inc'){
        setCartItems(prevCartItems =>{
            return prevCartItems.map(item => {
                if(item._id === foundProduct._id){
                    return {
                        ...foundProduct,
                        quantity: foundProduct.quantity +1
                       }
                }
                return item
            })
        })
       
        setTotalPrice(prevTotalPrice => prevTotalPrice+ foundProduct.price)
        setTotalQuantities(prevTotalQuantity => prevTotalQuantity+1)
       }else if(value=== 'dec'){
        if(foundProduct.quantity > 1){
            setCartItems(prevCartItems =>{
                return prevCartItems.map(item => {
                    if(item._id === foundProduct._id){
                        return {
                            ...foundProduct,
                            quantity: foundProduct.quantity -1
                           }
                    }
                    return item
                })
            })
           
            setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price)
            setTotalQuantities(prevTotalQuantity => prevTotalQuantity - 1)
        }
       }
    }
    
    const incQty =() =>{
        setQty(prevQty => prevQty+1)
    }

    const decQty =() =>{
        setQty(prevQty => {
            if(prevQty -1 < 1) return 1

            return prevQty-1
        })
    }

    return(
        <Context.Provider 
        value={{
            showCart,
            cartItems,
            totalPrice,
            totalQuantities,
            qty,
            setShowCart,
            setTotalPrice,
            setTotalQuantities,
            setCartItems,
            incQty,
            decQty,
            onAdd,
            toggleCartItemQuantity,
            onRemove
        }}
        >
            {children}
        </Context.Provider>
    )
}
export const useStateContext =() => useContext(Context)