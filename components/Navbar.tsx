import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';

export default function Navbar() {
    const router = useRouter();

    const isActive = (href: string) => {
        return router.pathname === href ? "border-b-2 border-white" : "";
    };

    const [prevScrollPos, setPrevScrollPos] = useState(0);
    const [visible, setVisible] = useState(true);
    const [opacity, setOpacity] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);

            if (currentScrollPos === 0) {
                setOpacity(1);
            } else if (currentScrollPos < prevScrollPos) {
                setOpacity(0.8);
            }

            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [prevScrollPos]);

    const navbarStyle = {
        top: visible ? '0' : '-100px',
        transition: 'top 0.3s',
        opacity: opacity,
    };

    return (
        <nav className="bg-[#ff6600] w-screen h-16 flex flex-row items-center justify-between px-16 fixed z-20" style={navbarStyle}>
            <Image src="/logosuitclear.png" alt="logo" width={100} height={40} />

            <div className="text-white w-1/4 flex flex-row items-center justify-evenly">
                <NavLink href="/work" activeStyle={isActive("/work")}>Work</NavLink>
                <NavLink href="/about" activeStyle={isActive("/about")}>About</NavLink>
                <NavLink href="/services" activeStyle={isActive("/services")}>Services</NavLink>
                <NavLink href="/" activeStyle={isActive("/")} >Ideas</NavLink>
                <NavLink href="/carrers" activeStyle={isActive("/carrers")}>Careers</NavLink>
                <NavLink href="/contact" activeStyle={isActive("/contact")}>Contact</NavLink>
            </div>
        </nav>
    );
}

type NavLinkProps = {
    href: string;
    children: React.ReactNode;
    activeStyle: string;
};

const NavLink = ({ href, children, activeStyle }: NavLinkProps) => {
    return (
        <Link href={href}>
            <div className={`cursor-pointer ${activeStyle}`}>
                {children}
            </div>
        </Link>
    );
};
