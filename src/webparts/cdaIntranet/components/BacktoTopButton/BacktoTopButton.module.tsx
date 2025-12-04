// import * as React from 'react'
// import styles from "./BacktoTopButton.module.scss"

// const BacktoTopButton = () => {
//     const [show, setShow] = React.useState(true);

//     React.useEffect(() => {
//         const handleScroll = () => {
//             setShow(window.pageYOffset > 300);
//         };

//         window.addEventListener("scroll", handleScroll);
//         return () => window.removeEventListener("scroll", handleScroll);
//     }, []);

//     const scrollToTop = () => {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     return (
//         <button
//             className={`${styles.backtoTop} ${show ? styles.show : ""}`}
//             onClick={scrollToTop}
//         >
//             <i className="fas fa-arrow-up"></i>
//         </button>
//     );
// };


// export default BacktoTopButton


import * as React from 'react';
import styles from './BacktoTopButton.module.scss';

interface BackToTopProps {
    scrollContainerRef?: React.RefObject<HTMLElement>;
}

const BackToTopButton: React.FC<BackToTopProps> = ({ scrollContainerRef }) => {
    // const [show, setShow] = React.useState(false);

    // React.useEffect(() => {
    //     const container = scrollContainerRef?.current || window;

    //     const handleScroll = () => {
    //         if (container === window) {
    //             setShow(window.scrollY > 300);
    //         } else {
    //             setShow((container as HTMLElement).scrollTop > 300);
    //         }
    //     };

    //     container.addEventListener('scroll', handleScroll);
    //     return () => container.removeEventListener('scroll', handleScroll);
    // }, [scrollContainerRef]);

    // const scrollToTop = () => {
    //     if (scrollContainerRef?.current) {
    //         scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    //     } else {
    //         window.scrollTo({ top: 0, behavior: 'smooth' });
    //     }
    // };
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        const container = scrollContainerRef?.current;

        if (!container) return; // wait until mounted

        const handleScroll = () => {
            setShow(container.scrollTop > 300);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [scrollContainerRef]);

    const scrollToTop = () => {
        if (scrollContainerRef?.current) {
            scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    return (
        <button
            className={`${styles.backtoTop} ${show ? styles.show : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <i className="fas fa-arrow-up"></i>
        </button>
    );
};

export default BackToTopButton;

