
const Footer = () => {
  return (
    <footer className="bg-[#1b263b] text-white p-6  w-full">
        <div className="container mx-auto text-center">
            <p className="text-sm">© {new Date().getFullYear()} MyApp. All rights reserved.</p>
            <p className="text-sm">Follow us on 
            <a href="https://twitter.com" className="text-white hover:underline ml-1">Twitter</a>, 
            <a href="https://facebook.com" className="text-white hover:underline ml-1">Facebook</a>, 
            <a href="https://instagram.com" className="text-white hover:underline ml-1">Instagram</a>
            </p>
        </div>
    </footer>
  )
}

export default Footer