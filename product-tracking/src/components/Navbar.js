import { NavLink } from "react-router-dom";

function Navbar() {
    return (
        <nav
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                backgroundColor: '#f8f9fa',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                width: '100%',
                top: 0,
                zIndex: 1000,
            }}
        >
            {/* Logo a sinistra */}
            <div
                style={{
                    position: "absolute",
                }}
            >
                <img 
                src={require("../logo_filiera360.png")}
                style={{
                    width:"8vw",
                }}
                />
            </div>

            {/* Icune di navigazione */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '3rem',
                    width:"100%"
                }}
            >
                <NavLink
                    to="/add-product"
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? '#007bff' : '#6c757d',
                        transition: 'color 0.3s ease',
                    })}
                >
                    <ion-icon name="add-circle-outline" style={{ fontSize: '24px', marginBottom: '4px' }}></ion-icon>
                    <span>Add Product</span>
                </NavLink>

                <NavLink
                    to="/scan-product"
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? '#007bff' : '#6c757d',
                        transition: 'color 0.3s ease',
                    })}
                >
                    <ion-icon name="scan-outline" style={{ fontSize: '24px', marginBottom: '4px' }}></ion-icon>
                    <span>Scan Product</span>
                </NavLink>

                <NavLink
                    to="/account"
                    style={({ isActive }) => ({
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textDecoration: 'none',
                        color: isActive ? '#007bff' : '#6c757d',
                        transition: 'color 0.3s ease',
                    })}
                >
                    <ion-icon name="person-circle-outline" style={{ fontSize: '24px', marginBottom: '4px' }}></ion-icon>
                    <span>Account</span>
                </NavLink>
            </div>
        </nav>

    )
}

export default Navbar;