import { AiFillInstagram, AiOutlineTwitter} from 'react-icons/ai'
const Footer = () => {
  return (
    <div className='footer-container'>
      <p>{new Date().getFullYear()} Tech store All rights reserved</p>
      <p className='icons'>
        <AiFillInstagram/>
        <AiOutlineTwitter/>

      </p>
      
    </div>
  )
}

export default Footer