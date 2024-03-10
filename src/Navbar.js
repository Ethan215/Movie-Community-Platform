export default function Navbar() {
    return <nav className="navbar">
        <a href="/home" className="site-title">Find a movie!</a>
        <ul>
            <li>
                <a href="/discover">Discover</a>
            </li>
            <li>    
                <a href="/new">New</a>
            </li>
            <li>    
                <a href="/genres">Genres</a>
            </li>
            <li>    
                <a href="/discover">Other</a>
            </li>  
        </ul>
    </nav>
}