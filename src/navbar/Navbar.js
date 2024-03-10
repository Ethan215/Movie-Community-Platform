export default function Navbar() {
    return <nav className="navbar">
        <ul>
            <li>    
                <a href="/home">Search</a>
            </li>  
            <li>    
                <div className="dropdown">
                    <a className="dropbtn">Genres</a>
                    <div className="dropdown-content">
                        <a href="/action">Action</a>
                        <a href="/adventure">Adventure</a>
                        <a href="/animation">Animation</a>
                        <a href="/comedy">Comedy</a>
                        <a href="/crime">Crime</a>
                        <a href="/drama">Drama</a>
                        <a href="/horror">Horror</a>
                        <a href="/music">Music</a>
                        <a href="/mystery">Mystery</a>
                        <a href="/romance">Romance</a>
                        <a href="/scifi">Sci-Fi</a>
                        <a href="/thriller">Thriller</a>
                    </div>
                </div>
            </li>
            <li>
                <a href="/discover">Discover</a>
            </li>
            <li>    
                <a href="/new">New</a>
            </li>
            
        </ul>
    </nav>
}